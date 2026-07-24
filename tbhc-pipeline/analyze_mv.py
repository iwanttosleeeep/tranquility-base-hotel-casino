#!/usr/bin/env python3
"""Extract shot timing and colour data from authorised local music-video files."""

from __future__ import annotations

import argparse
import json
import math
import shutil
import time
from pathlib import Path
from typing import Any


VIDEO_EXTENSIONS = {".mp4", ".mkv", ".webm"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create shot, palette, and reference-frame data from local video.")
    parser.add_argument("input", type=Path, help="A video file or a non-recursive directory of videos")
    parser.add_argument("--out", type=Path, default=Path("./out/analyze-mv"), help="Output directory (default: ./out/analyze-mv)")
    parser.add_argument("--threshold", type=float, default=27.0, help="PySceneDetect content threshold (default: 27.0)")
    parser.add_argument("--no-frames", action="store_true", help="Do not export analysis reference JPEGs")
    parser.add_argument("--force", action="store_true", help="Recreate existing outputs")
    return parser.parse_args()


def inputs_from(path: Path) -> list[Path]:
    if path.is_file():
        return [path] if path.suffix.lower() in VIDEO_EXTENSIONS else []
    if path.is_dir():
        return sorted(item for item in path.iterdir() if item.is_file() and item.suffix.lower() in VIDEO_EXTENSIONS)
    return []


def rounded(value: float, digits: int = 3) -> float:
    return round(float(value), digits)


def hex_colour(rgb: Any) -> str:
    return "#{:02x}{:02x}{:02x}".format(*[int(value) for value in rgb])


def palette_metrics(frame: Any) -> tuple[list[str], float, float]:
    import cv2
    import numpy as np

    height, width = frame.shape[:2]
    if width > 320:
        frame = cv2.resize(frame, (320, max(1, round(height * 320 / width))), interpolation=cv2.INTER_AREA)
    pixels = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB).reshape((-1, 3)).astype(np.float32)
    count = min(5, len(pixels))
    _, labels, centres = cv2.kmeans(pixels, count, None, (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0), 3, cv2.KMEANS_PP_CENTERS)
    counts = np.bincount(labels.flatten(), minlength=count)
    order = np.argsort(counts)[::-1]
    palette = [hex_colour(centres[index]) for index in order]
    brightness = float(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY).mean())
    saturation = float(cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)[:, :, 1].mean())
    return palette, brightness, saturation


def read_frame(capture: Any, time_s: float) -> Any:
    import cv2

    capture.set(cv2.CAP_PROP_POS_MSEC, max(0, time_s) * 1000)
    success, frame = capture.read()
    if not success or frame is None:
        raise RuntimeError(f"could not decode frame at {time_s:.3f}s")
    return frame


def save_frame(frame: Any, destination: Path) -> None:
    import cv2

    height, width = frame.shape[:2]
    if width > 640:
        frame = cv2.resize(frame, (640, max(1, round(height * 640 / width))), interpolation=cv2.INTER_AREA)
    if not cv2.imwrite(str(destination), frame, [cv2.IMWRITE_JPEG_QUALITY, 82]):
        raise RuntimeError(f"could not write {destination.name}")


def write_palette_barcode(shots: list[dict[str, object]], duration: float, destination: Path) -> None:
    from PIL import Image, ImageColor, ImageDraw

    width, target_height = 500, 1200
    bands = [max(1, round(target_height * float(shot["length_s"]) / duration)) for shot in shots]
    image = Image.new("RGB", (width, sum(bands)))
    draw = ImageDraw.Draw(image)
    y = 0
    for shot, height in zip(shots, bands):
        palette = shot["palette"]
        for index, colour in enumerate(palette):
            left = round(width * index / len(palette))
            right = round(width * (index + 1) / len(palette))
            draw.rectangle((left, y, right, y + height), fill=ImageColor.getrgb(colour))
        y += height
    image.save(destination)


def detect_scenes(source: Path, threshold: float, duration: float) -> list[tuple[float, float]]:
    from scenedetect import SceneManager, open_video
    from scenedetect.detectors import ContentDetector

    video = open_video(str(source))
    manager = SceneManager()
    manager.add_detector(ContentDetector(threshold=threshold))
    manager.detect_scenes(video)
    scenes = [(start.get_seconds(), end.get_seconds()) for start, end in manager.get_scene_list()]
    return scenes or [(0.0, duration)]


def outputs_ready(base: Path, export_frames: bool) -> bool:
    return (base.with_suffix(".shots.json")).is_file() and (base.with_suffix(".palette.png")).is_file() and (not export_frames or base.with_suffix(".frames")).is_dir()


def analyse_video(source: Path, out_dir: Path, threshold: float, export_frames: bool, force: bool) -> None:
    import cv2

    base = out_dir / source.stem
    json_path = base.with_suffix(".shots.json")
    palette_path = base.with_suffix(".palette.png")
    frames_dir = base.with_suffix(".frames")
    if outputs_ready(base, export_frames) and not force:
        raise FileExistsError("SKIP")
    if force and frames_dir.exists():
        shutil.rmtree(frames_dir)
    capture = cv2.VideoCapture(str(source))
    if not capture.isOpened():
        raise RuntimeError("could not open video")
    try:
        fps = float(capture.get(cv2.CAP_PROP_FPS))
        frame_count = float(capture.get(cv2.CAP_PROP_FRAME_COUNT))
        if fps <= 0 or frame_count <= 0:
            raise RuntimeError("video has no usable frame rate or frame count")
        duration = frame_count / fps
        if export_frames:
            frames_dir.mkdir(parents=True, exist_ok=True)
        shots: list[dict[str, object]] = []
        for index, (start, end) in enumerate(detect_scenes(source, threshold, duration)):
            end = min(end, duration)
            length = max(0.001, end - start)
            moments = {"start": start + length * 0.10, "mid": start + length * 0.50, "end": start + length * 0.90}
            mid_frame = read_frame(capture, moments["mid"])
            palette, brightness, saturation = palette_metrics(mid_frame)
            shots.append({"index": index, "start_s": rounded(start), "end_s": rounded(end), "length_s": rounded(length), "palette": palette, "brightness": rounded(brightness, 1), "saturation": rounded(saturation, 1)})
            if export_frames:
                for label, moment in moments.items():
                    frame = mid_frame if label == "mid" else read_frame(capture, moment)
                    save_frame(frame, frames_dir / f"shot{index:04d}_{label}.jpg")
        payload = {"source": source.name, "fps": rounded(fps, 3), "duration_s": rounded(duration), "shot_count": len(shots), "shots": shots}
        json_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
        write_palette_barcode(shots, duration, palette_path)
    finally:
        capture.release()


def main() -> int:
    args = parse_args()
    files = inputs_from(args.input)
    args.out.mkdir(parents=True, exist_ok=True)
    errors = args.out / "errors.log"
    if not files:
        print(f"No supported video files found in {args.input}")
        return 1
    complete = 0
    for source in files:
        started = time.monotonic()
        try:
            analyse_video(source, args.out, args.threshold, not args.no_frames, args.force)
            print(f"OK {source.name} {time.monotonic() - started:.1f}s")
            complete += 1
        except FileExistsError as error:
            if str(error) == "SKIP":
                print(f"SKIP {source.name} {time.monotonic() - started:.1f}s")
                complete += 1
            else:
                raise
        except Exception as error:
            with errors.open("a", encoding="utf-8") as handle:
                handle.write(f"{source}: {error}\n")
            print(f"FAIL {source.name} {time.monotonic() - started:.1f}s")
    return 0 if complete else 1


if __name__ == "__main__":
    raise SystemExit(main())
