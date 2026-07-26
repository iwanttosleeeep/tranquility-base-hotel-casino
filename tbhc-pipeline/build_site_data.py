#!/usr/bin/env python3
"""Derive the site's compact arrangement data from analysis_version 2 JSON.

The analysis JSONs are large and private. The website ships a small derived
subset. Keeping that derivation in a committed script rather than doing it by
hand means the numbers on the page can always be traced back to a measurement.

    python build_site_data.py /opt/tbhc-pipeline/output/audio-analysis-v2 \
        --out ../src/data/audioAnalysis.ts

It also prints a calibration table across every track, which is what the
sentence thresholds should be chosen against — not against one song.
"""

from __future__ import annotations

import argparse
import json
import statistics
from pathlib import Path
from typing import Any

STEMS = ("vocals", "drums", "bass", "guitar", "piano", "other")

# Presence is reported against a stated share, not against a hidden "active"
# flag. Any sentence built on it must repeat the number.
PRESENCE_SHARE = 0.10
# Display grid target column width, resampled from the analysis windows.
GRID_SECONDS = 5.0
# Activity runs shorter than this are treated as threshold flicker, not as
# arrangement events.
MIN_RUN_S = 8.0

# How far a stem's presence may move when the threshold is halved before the
# figure is treated as an artefact of the threshold rather than a property of
# the recording. Measured, not assumed: see calibration output.
ROBUST_DELTA = 0.10

# A property of the separation model, not of these recordings. htdemucs_6s is
# documented as experimental for guitar and piano, and "other" is whatever the
# model could not assign.
SEPARATION_CONFIDENCE = {
    "vocals": "high",
    "drums": "high",
    "bass": "high",
    "guitar": "experimental",
    "piano": "experimental",
    "other": "residual",
}

ALBUM_TRACK_ORDER = {
    "star-treatment": 1,
    "one-point-perspective": 2,
    "american-sports": 3,
    "tranquility-base-hotel-and-casino": 4,
    "golden-trunks": 5,
    "four-out-of-five": 6,
    "the-worlds-first-ever-monster-truck-front-flip": 7,
    "science-fiction": 8,
    "she-looks-like-fun": 9,
    "batphone": 10,
    "the-ultracheese": 11,
    "anyways": 12,
}


def strip_common_prefix(names: list[str]) -> dict[str, str]:
    """Stem directories are named after the source file, which usually carries an
    artist prefix. Removing the prefix shared by every track keeps ids aligned
    with the song ids used elsewhere on the site."""
    if len(names) < 2:
        return {name: name for name in names}
    shortest = min(len(name) for name in names)
    length = 0
    while length < shortest and len({name[length] for name in names}) == 1:
        length += 1
    prefix = names[0][:length]
    # Only cut at a separator, never mid-word.
    cut = max(prefix.rfind(" - "), prefix.rfind(" — "), prefix.rfind("_-_"))
    if cut < 0:
        return {name: name for name in names}
    return {name: name[cut + 3:].strip() or name for name in names}


def slugify(name: str) -> str:
    cleaned = []
    for character in name.lower():
        cleaned.append(character if character.isalnum() else "-")
    slug = "".join(cleaned)
    while "--" in slug:
        slug = slug.replace("--", "-")
    slug = slug.strip("-")
    return {
        "tranquility-base-hotel-casino": "tranquility-base-hotel-and-casino",
        "the-world-s-first-ever-monster-truck-front-flip": "the-worlds-first-ever-monster-truck-front-flip",
    }.get(slug, slug)


def digit_string(values: list[float], reference: float) -> str:
    """Quantise a series to 0-9 against a shared reference."""
    if not reference:
        return "0" * len(values)
    return "".join(str(min(9, int(round(9 * value / reference)))) for value in values)


def resample(values: list[float], source_window: float, target_window: float) -> list[float]:
    if source_window >= target_window or not values:
        return values
    factor = max(1, int(round(target_window / source_window)))
    return [
        max(values[index:index + factor])
        for index in range(0, len(values), factor)
    ]


def clean_runs(flags: list[bool], window_s: float, min_run_s: float) -> list[bool]:
    """Remove on/off runs shorter than min_run_s so threshold flicker does not
    read as an instrument entering and leaving."""
    if not flags:
        return flags
    minimum = max(1, int(round(min_run_s / window_s)))
    cleaned = list(flags)
    start = 0
    for index in range(1, len(cleaned) + 1):
        if index == len(cleaned) or cleaned[index] != cleaned[start]:
            if index - start < minimum and start > 0:
                for position in range(start, index):
                    cleaned[position] = cleaned[start - 1]
            start = index
    return cleaned


def stem_timelines(document: dict[str, Any]) -> tuple[dict[str, list[float]], dict[str, list[float]], float]:
    shares: dict[str, list[float]] = {}
    levels: dict[str, list[float]] = {}
    window_s = float(document["window_s"])
    for stem in STEMS:
        windows = document["stems"][stem]["energy_windows"]
        shares[stem] = [float(entry.get("share", 0.0)) for entry in windows]
        levels[stem] = [float(entry["rms"]) for entry in windows]
    return shares, levels, window_s


def build_track(path: Path, presence_share: float = PRESENCE_SHARE, title: str | None = None) -> dict[str, Any]:
    document = json.loads(path.read_text(encoding="utf-8"))
    if int(document.get("analysis_version", 1)) < 2:
        raise SystemExit(f"{path.name} is analysis_version 1 — re-run analyze_audio.py first")

    duration = float(document["duration_s"])
    shares, levels, window_s = stem_timelines(document)
    count = max(len(values) for values in shares.values())

    beats = document["beat_tracking"]["beat_times_s"]
    intervals = [beats[index + 1] - beats[index] for index in range(len(beats) - 1)]
    median_interval = statistics.median(intervals) if intervals else 0.0
    stability = (statistics.pstdev(intervals) / median_interval) if median_interval else 0.0

    presence: dict[str, float] = {}
    cleaned: dict[str, list[bool]] = {}
    summaries: dict[str, dict[str, float]] = {}
    for stem in STEMS:
        flags = clean_runs([value > presence_share for value in shares[stem]], window_s, MIN_RUN_S)
        cleaned[stem] = flags
        presence[stem] = sum(flags) / count if count else 0.0
        # The same measurement at half the threshold. If presence barely moves the
        # figure describes the recording; if it lurches it describes the threshold.
        loose = clean_runs([value > presence_share / 2 for value in shares[stem]], window_s, MIN_RUN_S)
        loose_presence = sum(loose) / count if count else 0.0
        delta = abs(loose_presence - presence[stem])
        stats = document["stems"][stem]
        summaries[stem] = {
            "onsetsPerMin": round(stats["onset_count"] / (duration / 60), 1),
            "centroidHz": round(float(stats["spectral_centroid_mean_hz"])),
            "crest": round(float(stats["rms_p95"]) / float(stats["rms_mean"]), 2) if stats["rms_mean"] else 0.0,
            "shareMean": round(statistics.fmean(shares[stem]), 4) if shares[stem] else 0.0,
            "presence": round(presence[stem], 3),
            "presenceLoose": round(loose_presence, 3),
            "presenceDelta": round(delta, 3),
            "presenceRobust": bool(delta <= ROBUST_DELTA),
            "confidence": SEPARATION_CONFIDENCE[stem],
        }

    # Entries and exits, taken from the cleaned timelines.
    events: list[dict[str, Any]] = []
    for index in range(1, count):
        entering = [stem for stem in STEMS if cleaned[stem][index] and not cleaned[stem][index - 1]]
        leaving = [stem for stem in STEMS if not cleaned[stem][index] and cleaned[stem][index - 1]]
        if entering or leaving:
            events.append({"atS": round(index * window_s, 1), "enter": entering, "exit": leaving})

    # Thinnest sustained passage, ignoring the run-in and the fade.
    active_counts = [sum(cleaned[stem][index] for stem in STEMS) for index in range(count)]
    interior = [(index, value) for index, value in enumerate(active_counts) if value > 0]
    thinnest = None
    if interior:
        first, last = interior[0][0], interior[-1][0]
        window_slice = active_counts[first:last + 1]
        floor = min(window_slice)
        start = window_slice.index(floor) + first
        end = start
        while end + 1 <= last and active_counts[end + 1] == floor:
            end += 1
        thinnest = {
            "startS": round(start * window_s, 1),
            "endS": round(min((end + 1) * window_s, duration), 1),
            "stems": [stem for stem in STEMS if cleaned[stem][start]],
        }

    grid_reference = max(max(values) for values in levels.values())
    share_reference = max(max(values) for values in shares.values())

    # Beat trackers routinely lock an octave away from the felt pulse, so the
    # plausible alternatives are carried alongside rather than silently dropped.
    tempo = float(document["beat_tracking"]["estimated_tempo_bpm"])
    alternates = [round(value, 1) for value in (tempo / 2, tempo * 2) if 60.0 <= value <= 180.0]

    display_title = title or document["source"]
    return {
        "id": slugify(display_title),
        "title": display_title,
        "durationS": round(duration, 3),
        "tempoBpm": tempo,
        "tempoAlternatesBpm": alternates,
        "tempoAmbiguous": bool(alternates),
        "beatCount": len(beats),
        "tempoStability": round(stability, 4),
        "windowS": window_s,
        "gridSeconds": GRID_SECONDS,
        "levels": {
            stem: digit_string(resample(levels[stem], window_s, GRID_SECONDS), grid_reference)
            for stem in STEMS
        },
        "shares": {stem: digit_string(shares[stem], share_reference) for stem in STEMS},
        "stems": summaries,
        "events": events,
        "thinnest": thinnest,
    }


def render_typescript(tracks: list[dict[str, Any]], presence_share: float) -> str:
    body = ",\n".join("  " + json.dumps(track, ensure_ascii=False) for track in tracks)
    return f'''// GENERATED by tbhc-pipeline/build_site_data.py — do not edit by hand.
// Derived from private analysis_version 2 measurements. Presence is reported as
// the share of runtime in which a stem holds more than {presence_share:.0%} of the
// summed stem energy; it is a measurement of signal share, not of audibility.

export const STEM_ORDER = ["vocals", "drums", "bass", "guitar", "piano", "other"] as const;
export type StemName = (typeof STEM_ORDER)[number];

export const PRESENCE_SHARE = {presence_share};

export type SeparationConfidence = "high" | "experimental" | "residual";

/** A property of the separation model, not of the recordings. */
export const SEPARATION_CONFIDENCE: Record<StemName, SeparationConfidence> = {{
  vocals: "high",
  drums: "high",
  bass: "high",
  guitar: "experimental",
  piano: "experimental",
  other: "residual",
}};

export interface StemSummary {{
  onsetsPerMin: number;
  centroidHz: number;
  crest: number;
  shareMean: number;
  /** Share of runtime above PRESENCE_SHARE of summed stem energy. */
  presence: number;
  /** The same measurement at half the threshold. */
  presenceLoose: number;
  presenceDelta: number;
  /** False when the figure moves more than the threshold change warrants; such
   *  a presence must not be stated as a fact about the arrangement. */
  presenceRobust: boolean;
  confidence: SeparationConfidence;
}}

export interface ArrangementEvent {{
  atS: number;
  enter: StemName[];
  exit: StemName[];
}}

export interface ArrangementScore {{
  id: string;
  title: string;
  durationS: number;
  tempoBpm: number;
  tempoAlternatesBpm: number[];
  tempoAmbiguous: boolean;
  beatCount: number;
  tempoStability: number;
  windowS: number;
  gridSeconds: number;
  levels: Record<StemName, string>;
  shares: Record<StemName, string>;
  stems: Record<StemName, StemSummary>;
  events: ArrangementEvent[];
  thinnest: {{ startS: number; endS: number; stems: StemName[] }} | null;
}}

export const ARRANGEMENT_SCORES: ArrangementScore[] = [
{body}
];
'''


def calibration(tracks: list[dict[str, Any]]) -> str:
    lines = ["", "=== calibration across " + str(len(tracks)) + " tracks ===",
             f"{'track':<34}{'bpm':>7}{'stab':>7}{'thin':>6}  presence by stem (vocals/drums/bass/guitar/piano/other)"]
    for track in tracks:
        presence = "/".join(f"{int(track['stems'][stem]['presence'] * 100):3d}" for stem in STEMS)
        thin = len(track["thinnest"]["stems"]) if track["thinnest"] else 0
        lines.append(
            f"{track['title'][:33]:<34}{track['tempoBpm']:>7.1f}{track['tempoStability']:>7.3f}{thin:>6}  {presence}"
        )
    lines.append("")
    lines.append(f"{'metric':<20}{'min':>10}{'median':>10}{'max':>10}")
    for label, getter in (
        ("onsets/min", lambda t, s: t["stems"][s]["onsetsPerMin"]),
        ("centroid Hz", lambda t, s: t["stems"][s]["centroidHz"]),
        ("crest", lambda t, s: t["stems"][s]["crest"]),
        ("presence", lambda t, s: t["stems"][s]["presence"]),
    ):
        values = [getter(track, stem) for track in tracks for stem in STEMS]
        lines.append(f"{label:<20}{min(values):>10.2f}{statistics.median(values):>10.2f}{max(values):>10.2f}")
    events = [len(track["events"]) for track in tracks]
    lines.append(f"{'events/track':<20}{min(events):>10.2f}{statistics.median(events):>10.2f}{max(events):>10.2f}")
    lines.append("")
    lines.append("=== presence robustness (threshold halved) ===")
    lines.append(f"{'stem':<12}{'median d':>10}{'max d':>8}{'unstable':>10}{'confidence':>14}")
    for stem in STEMS:
        deltas = [track["stems"][stem]["presenceDelta"] for track in tracks]
        unstable = sum(1 for track in tracks if not track["stems"][stem]["presenceRobust"])
        lines.append(
            f"{stem:<12}{statistics.median(deltas):>10.3f}{max(deltas):>8.3f}"
            f"{unstable:>7d}/{len(tracks):<2d}{SEPARATION_CONFIDENCE[stem]:>14}"
        )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("input", type=Path, help="Directory of *.analysis.json produced by analyze_audio.py")
    parser.add_argument("--out", type=Path, default=Path("../src/data/audioAnalysis.ts"), help="TypeScript file to write")
    parser.add_argument("--presence-share", type=float, default=PRESENCE_SHARE, help="Share of window energy counted as present (default: 0.10)")
    args = parser.parse_args()

    sources = sorted(args.input.glob("*.analysis.json"))
    if not sources:
        raise SystemExit(f"No *.analysis.json found in {args.input}")

    titles = strip_common_prefix([json.loads(path.read_text(encoding="utf-8"))["source"] for path in sources])
    tracks = [
        build_track(path, args.presence_share, titles[json.loads(path.read_text(encoding="utf-8"))["source"]])
        for path in sources
    ]
    tracks.sort(key=lambda track: ALBUM_TRACK_ORDER.get(track["id"], 99))

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(render_typescript(tracks, args.presence_share), encoding="utf-8")
    print(f"wrote {args.out} from {len(tracks)} tracks ({args.out.stat().st_size / 1024:.1f} kB)")
    print(calibration(tracks))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
