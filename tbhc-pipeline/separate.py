#!/usr/bin/env python3
"""Separate authorised audio into private analysis stems with Demucs."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path


AUDIO_EXTENSIONS = {".mp3", ".flac", ".wav", ".m4a"}
DEFAULT_STEMS = ("vocals.wav", "drums.wav", "bass.wav", "other.wav")
SIX_STEMS = DEFAULT_STEMS + ("guitar.wav", "piano.wav")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create private Demucs stems from authorised local audio."
    )
    parser.add_argument("input", type=Path, help="An audio file or a non-recursive directory of audio files")
    parser.add_argument("--out", type=Path, default=Path("./out/separate"), help="Output directory (default: ./out/separate)")
    parser.add_argument("--six", action="store_true", help="Use experimental htdemucs_6s (adds guitar and piano)")
    parser.add_argument("--force", action="store_true", help="Recreate output directories that already contain stems")
    return parser.parse_args()


def inputs_from(path: Path) -> list[Path]:
    if path.is_file():
        return [path] if path.suffix.lower() in AUDIO_EXTENSIONS else []
    if path.is_dir():
        return sorted(item for item in path.iterdir() if item.is_file() and item.suffix.lower() in AUDIO_EXTENSIONS)
    return []


def cuda_device() -> str:
    try:
        import torch

        return "cuda" if torch.cuda.is_available() else "cpu"
    except ImportError:
        return "cpu"


def has_expected_stems(directory: Path, stems: tuple[str, ...]) -> bool:
    return directory.is_dir() and all((directory / stem).is_file() for stem in stems)


def append_error(error_log: Path, source: Path, error: str) -> None:
    with error_log.open("a", encoding="utf-8") as handle:
        handle.write(f"{source}: {error}\n")


def find_demucs_stems(temp_out: Path, stems: tuple[str, ...]) -> Path | None:
    for candidate in temp_out.rglob("*"):
        if candidate.is_dir() and has_expected_stems(candidate, stems):
            return candidate
    return None


def separate_file(source: Path, out_dir: Path, model: str, stems: tuple[str, ...], device: str, force: bool) -> str:
    target = out_dir / source.stem
    if has_expected_stems(target, stems) and not force:
        return "SKIP"
    if target.exists() and force:
        shutil.rmtree(target)
    elif target.exists():
        return "SKIP"

    with tempfile.TemporaryDirectory(prefix="demucs-", dir=out_dir) as temp_name:
        temp_out = Path(temp_name)
        command = [
            sys.executable,
            "-m",
            "demucs.separate",
            "--name",
            model,
            "--device",
            device,
            "--out",
            str(temp_out),
            str(source),
        ]
        completed = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        if completed.returncode != 0:
            raise RuntimeError(completed.stdout.strip() or f"Demucs exited {completed.returncode}")
        produced = find_demucs_stems(temp_out, stems)
        if produced is None:
            raise RuntimeError("Demucs completed but expected stem files were not found")
        shutil.move(str(produced), str(target))
    return "OK"


def main() -> int:
    args = parse_args()
    files = inputs_from(args.input)
    args.out.mkdir(parents=True, exist_ok=True)
    error_log = args.out / "errors.log"
    model = "htdemucs_6s" if args.six else "htdemucs"
    stems = SIX_STEMS if args.six else DEFAULT_STEMS
    device = cuda_device()
    if device == "cpu":
        print("WARNING CUDA unavailable; Demucs will run on CPU and may take several minutes per song.")
    if not files:
        print(f"No supported audio files found in {args.input}", file=sys.stderr)
        return 1

    succeeded = 0
    for source in files:
        started = time.monotonic()
        try:
            status = separate_file(source, args.out, model, stems, device, args.force)
            if status == "OK":
                succeeded += 1
            elif status == "SKIP":
                succeeded += 1
            print(f"{status} {source.name} {time.monotonic() - started:.1f}s")
        except Exception as error:  # Continue batch work; the error log preserves the source and reason.
            append_error(error_log, source, str(error))
            print(f"FAIL {source.name} {time.monotonic() - started:.1f}s", file=sys.stderr)

    return 0 if succeeded else 1


if __name__ == "__main__":
    raise SystemExit(main())
