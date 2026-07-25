#!/usr/bin/env python3
"""Turn private Demucs stems into compact, signal-derived arrangement data."""

from __future__ import annotations

import argparse
import json
import time
from pathlib import Path
from typing import Any


STEMS = ("vocals", "drums", "bass", "guitar", "piano", "other")
SAMPLE_RATE = 22_050
HOP_LENGTH = 512
ANALYSIS_VERSION = 2

# v1 marked a stem "active" when its own window energy came within 24 dB of that
# same stem's loudest window. The reference was per-stem, so a stem with one loud
# peak raised its own bar and read as absent for most of the song, while a stem
# that played quietly throughout read as present almost always. The flag measured
# a stem against itself, not against what was audible in the mix.
V1_STEM_RELATIVE_DB = -24.0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create private, signal-derived arrangement JSON from six Demucs stems."
    )
    parser.add_argument("input", type=Path, help="One six-stem directory or a directory containing song stem directories")
    parser.add_argument("--out", type=Path, default=Path("./out/audio-analysis"), help="Output directory (default: ./out/audio-analysis)")
    parser.add_argument("--window", type=float, default=5.0, help="Energy/activity window in seconds (default: 5.0)")
    parser.add_argument("--share-db", type=float, default=-30.0, help="A stem counts as active when it holds at least this share of the window's total stem energy, in dB (default: -30)")
    parser.add_argument("--floor-db", type=float, default=-40.0, help="Absolute gate, in dB below the loudest mixed window, under which nothing counts as active (default: -40)")
    parser.add_argument("--force", action="store_true", help="Recreate analysis JSON that already exists")
    return parser.parse_args()


def stem_directories(path: Path) -> list[Path]:
    if not path.is_dir():
        return []
    if all((path / f"{stem}.wav").is_file() for stem in STEMS):
        return [path]
    return sorted(
        candidate for candidate in path.iterdir()
        if candidate.is_dir() and all((candidate / f"{stem}.wav").is_file() for stem in STEMS)
    )


def rounded(value: float, digits: int = 3) -> float:
    return round(float(value), digits)


def window_rms(signal: Any, sample_rate: int, window_s: float) -> list[float]:
    """Per-window RMS for one stem. No activity decision is taken here."""
    import numpy as np

    frame_size = max(1, int(window_s * sample_rate))
    values: list[float] = []
    for start in range(0, len(signal), frame_size):
        frame = signal[start:start + frame_size]
        values.append(float(np.sqrt(np.mean(np.square(frame)))) if frame.size else 0.0)
    return values


def build_energy_windows(
    stem_values: dict[str, list[float]],
    duration: float,
    window_s: float,
    share_db: float,
    floor_db: float,
) -> dict[str, list[dict[str, float | bool]]]:
    """Decide activity per stem per window, judged against the mix rather than
    against each stem's own peak.

    Two gates must both pass:
      * share  — the stem holds at least `share_db` of the summed stem energy in
                 that window, so a quiet instrument is judged by its part in what
                 is sounding at the time rather than by absolute level;
      * floor  — the window is at least `floor_db` under the loudest mixed window,
                 which keeps separation residue in silent passages out.

    Every input to the decision is written back into the JSON (`rms`, `mix_rms`,
    `share`), so any later change of threshold can be recomputed from this file
    without touching audio again.
    """
    count = max((len(values) for values in stem_values.values()), default=0)
    mix = [sum(stem_values[stem][index] for stem in STEMS if index < len(stem_values[stem])) for index in range(count)]
    mix_peak = max(mix, default=0.0)
    floor = mix_peak * (10 ** (floor_db / 20)) if mix_peak else 0.0
    share_ratio = 10 ** (share_db / 20)

    windows: dict[str, list[dict[str, float | bool]]] = {}
    for stem in STEMS:
        values = stem_values[stem]
        v1_reference = max(values, default=0.0)
        v1_threshold = v1_reference * (10 ** (V1_STEM_RELATIVE_DB / 20)) if v1_reference else 0.0
        entries: list[dict[str, float | bool]] = []
        for index, value in enumerate(values):
            mix_value = mix[index] if index < len(mix) else 0.0
            share = (value / mix_value) if mix_value else 0.0
            entries.append({
                "start_s": rounded(index * window_s),
                "end_s": rounded(min((index + 1) * window_s, duration)),
                "rms": rounded(value, 6),
                "mix_rms": rounded(mix_value, 6),
                "share": rounded(share, 4),
                "active": bool(value > floor and share > share_ratio),
                # Retained so v1 and v2 can be compared window by window.
                "active_v1": bool(value > v1_threshold),
            })
        windows[stem] = entries
    return windows


def analyse_stem(path: Path, window_s: float) -> tuple[dict[str, object], list[float], Any, int]:
    import librosa
    import numpy as np

    signal, sample_rate = librosa.load(path, sr=SAMPLE_RATE, mono=True)
    duration = len(signal) / sample_rate
    rms = librosa.feature.rms(y=signal, hop_length=HOP_LENGTH)[0]
    centroid = librosa.feature.spectral_centroid(y=signal, sr=sample_rate, hop_length=HOP_LENGTH)[0]
    onset_frames = librosa.onset.onset_detect(y=signal, sr=sample_rate, hop_length=HOP_LENGTH, units="frames")
    summary: dict[str, object] = {
        "duration_s": rounded(duration),
        "rms_mean": rounded(np.mean(rms), 6),
        "rms_p95": rounded(np.percentile(rms, 95), 6),
        "spectral_centroid_mean_hz": rounded(np.mean(centroid), 1),
        "onset_count": int(len(onset_frames)),
    }
    return summary, window_rms(signal, sample_rate, window_s), signal, sample_rate


def compact_arrangement(stems: dict[str, dict[str, object]], window_s: float, duration: float, flag: str = "active") -> list[dict[str, object]]:
    windows = {stem: data["energy_windows"] for stem, data in stems.items()}
    count = max((len(items) for items in windows.values()), default=0)
    segments: list[dict[str, object]] = []
    for index in range(count):
        active = tuple(stem for stem in STEMS if index < len(windows[stem]) and windows[stem][index][flag])
        start_s = index * window_s
        end_s = min((index + 1) * window_s, duration)
        if segments and segments[-1]["active_stems"] == list(active):
            segments[-1]["end_s"] = rounded(end_s)
        else:
            segments.append({"start_s": rounded(start_s), "end_s": rounded(end_s), "active_stems": list(active)})
    return segments


def analyse_song(directory: Path, window_s: float, share_db: float, floor_db: float) -> dict[str, object]:
    import librosa
    import numpy as np

    stem_data: dict[str, dict[str, object]] = {}
    stem_values: dict[str, list[float]] = {}
    drum_signal: Any | None = None
    drum_rate: int | None = None
    duration = 0.0
    for stem in STEMS:
        summary, values, signal, sample_rate = analyse_stem(directory / f"{stem}.wav", window_s)
        stem_data[stem] = summary
        stem_values[stem] = values
        duration = max(duration, float(summary["duration_s"]))
        if stem == "drums":
            drum_signal, drum_rate = signal, sample_rate

    windows = build_energy_windows(stem_values, duration, window_s, share_db, floor_db)
    for stem in STEMS:
        stem_data[stem]["energy_windows"] = windows[stem]

    assert drum_signal is not None and drum_rate is not None
    tempo, beat_frames = librosa.beat.beat_track(y=drum_signal, sr=drum_rate, hop_length=HOP_LENGTH)
    tempo_value = float(np.asarray(tempo).reshape(-1)[0])
    beat_times = librosa.frames_to_time(beat_frames, sr=drum_rate, hop_length=HOP_LENGTH)
    return {
        "source": directory.name,
        "analysis_version": ANALYSIS_VERSION,
        "duration_s": rounded(duration),
        "window_s": window_s,
        "activity_method": {
            "rule": "A stem is active in a window when it holds more than share_db of the summed stem energy in that window and the window is above floor_db relative to the loudest mixed window.",
            "share_db": share_db,
            "floor_db": floor_db,
            "v1_rule": "Superseded. A stem was active when its window energy came within 24 dB of that stem's own loudest window, which judged each stem against itself rather than against the mix.",
            "v1_stem_relative_db": V1_STEM_RELATIVE_DB,
        },
        "beat_tracking": {
            "source_stem": "drums",
            "estimated_tempo_bpm": rounded(tempo_value, 2),
            "beat_times_s": [rounded(value) for value in beat_times],
        },
        "stems": stem_data,
        "arrangement_profile": compact_arrangement(stem_data, window_s, duration),
        "arrangement_profile_v1": compact_arrangement(stem_data, window_s, duration, flag="active_v1"),
        "method_note": "All values are derived from separated audio signals. Activity indicates a stem's share of measured signal energy, not verified instrument presence, audibility, or a musicological interpretation. Separation is imperfect and stems bleed into one another; the 'other' stem is a residual category and should carry the least confidence.",
    }


def append_error(error_log: Path, source: Path, error: Exception) -> None:
    with error_log.open("a", encoding="utf-8") as handle:
        handle.write(f"{source}: {error}\n")


def main() -> int:
    args = parse_args()
    if args.window <= 0:
        raise SystemExit("--window must be greater than zero")
    sources = stem_directories(args.input)
    args.out.mkdir(parents=True, exist_ok=True)
    error_log = args.out / "errors.log"
    if not sources:
        print(f"No six-stem directories found in {args.input}")
        return 1

    complete = 0
    for source in sources:
        destination = args.out / f"{source.name}.analysis.json"
        started = time.monotonic()
        if destination.is_file() and not args.force:
            complete += 1
            print(f"SKIP {source.name} {time.monotonic() - started:.1f}s")
            continue
        try:
            result = analyse_song(source, args.window, args.share_db, args.floor_db)
            destination.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            complete += 1
            print(f"OK {source.name} {time.monotonic() - started:.1f}s")
        except Exception as error:
            append_error(error_log, source, error)
            print(f"FAIL {source.name} {time.monotonic() - started:.1f}s")
    return 0 if complete else 1


if __name__ == "__main__":
    raise SystemExit(main())
