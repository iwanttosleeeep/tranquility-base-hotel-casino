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


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create private, signal-derived arrangement JSON from six Demucs stems."
    )
    parser.add_argument("input", type=Path, help="One six-stem directory or a directory containing song stem directories")
    parser.add_argument("--out", type=Path, default=Path("./out/audio-analysis"), help="Output directory (default: ./out/audio-analysis)")
    parser.add_argument("--window", type=float, default=5.0, help="Energy/activity window in seconds (default: 5.0)")
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


def window_energy(signal: Any, sample_rate: int, duration: float, window_s: float) -> list[dict[str, float | bool]]:
    import numpy as np

    peak = float(np.sqrt(np.mean(np.square(signal)))) if signal.size else 0.0
    # A relative threshold makes the activity indicator resilient to level changes
    # between stems. It is an energy signal, not a claim of audible instrument presence.
    frame_size = max(1, int(window_s * sample_rate))
    values: list[float] = []
    for start in range(0, len(signal), frame_size):
        frame = signal[start:start + frame_size]
        values.append(float(np.sqrt(np.mean(np.square(frame)))) if frame.size else 0.0)
    reference = max(values, default=peak)
    threshold = reference * (10 ** (-24 / 20)) if reference else 0.0
    return [
        {
            "start_s": rounded(index * window_s),
            "end_s": rounded(min((index + 1) * window_s, duration)),
            "rms": rounded(value, 6),
            "active": bool(value > threshold),
        }
        for index, value in enumerate(values)
    ]


def analyse_stem(path: Path, window_s: float) -> tuple[dict[str, object], Any, int]:
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
        "energy_windows": window_energy(signal, sample_rate, duration, window_s),
    }
    return summary, signal, sample_rate


def compact_arrangement(stems: dict[str, dict[str, object]], window_s: float, duration: float) -> list[dict[str, object]]:
    windows = {stem: data["energy_windows"] for stem, data in stems.items()}
    count = max((len(items) for items in windows.values()), default=0)
    segments: list[dict[str, object]] = []
    for index in range(count):
        active = tuple(stem for stem in STEMS if index < len(windows[stem]) and windows[stem][index]["active"])
        start_s = index * window_s
        end_s = min((index + 1) * window_s, duration)
        if segments and segments[-1]["active_stems"] == list(active):
            segments[-1]["end_s"] = rounded(end_s)
        else:
            segments.append({"start_s": rounded(start_s), "end_s": rounded(end_s), "active_stems": list(active)})
    return segments


def analyse_song(directory: Path, window_s: float) -> dict[str, object]:
    import librosa
    import numpy as np

    stem_data: dict[str, dict[str, object]] = {}
    drum_signal: Any | None = None
    drum_rate: int | None = None
    duration = 0.0
    for stem in STEMS:
        summary, signal, sample_rate = analyse_stem(directory / f"{stem}.wav", window_s)
        stem_data[stem] = summary
        duration = max(duration, float(summary["duration_s"]))
        if stem == "drums":
            drum_signal, drum_rate = signal, sample_rate

    assert drum_signal is not None and drum_rate is not None
    tempo, beat_frames = librosa.beat.beat_track(y=drum_signal, sr=drum_rate, hop_length=HOP_LENGTH)
    tempo_value = float(np.asarray(tempo).reshape(-1)[0])
    beat_times = librosa.frames_to_time(beat_frames, sr=drum_rate, hop_length=HOP_LENGTH)
    return {
        "source": directory.name,
        "analysis_version": 1,
        "duration_s": rounded(duration),
        "window_s": window_s,
        "beat_tracking": {
            "source_stem": "drums",
            "estimated_tempo_bpm": rounded(tempo_value, 2),
            "beat_times_s": [rounded(value) for value in beat_times],
        },
        "stems": stem_data,
        "arrangement_profile": compact_arrangement(stem_data, window_s, duration),
        "method_note": "All values are derived from separated audio signals. Activity windows indicate relative signal energy, not verified instrument presence or a musicological interpretation.",
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
            result = analyse_song(source, args.window)
            destination.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            complete += 1
            print(f"OK {source.name} {time.monotonic() - started:.1f}s")
        except Exception as error:
            append_error(error_log, source, error)
            print(f"FAIL {source.name} {time.monotonic() - started:.1f}s")
    return 0 if complete else 1


if __name__ == "__main__":
    raise SystemExit(main())
