# TBHC Media Pipeline

Small, resumable batch tools for producing structured research data from media that you have permission to process. This directory is not a public web service and does not publish raw media or derived audio.

> **Machine-analysis disclosure:** every audio and video analytical readout produced from this pipeline and published by the site is entirely machine/AI generated. No human musicologist, audio engineer, cinematographer, or film scholar authors, verifies, or corrects those readouts. Demucs performs AI source separation; the remaining audio and image features are calculated automatically. Outputs describe detected features only and may be wrong. They do not establish artistic intent, meaning, quality, influence, or causation.

## Music analysis — `separate.py`

Creates four private Demucs stems (`vocals`, `drums`, `bass`, `other`) from an authorised local audio file or all supported files in a directory. The script is idempotent: a complete existing stem directory prints `SKIP` unless `--force` is supplied.

```bash
source .venv/bin/activate
python separate.py /opt/tbhc-pipeline/incoming/song.flac --out /opt/tbhc-pipeline/output/separate
```

Use `--six` for Demucs' experimental `htdemucs_6s` model, which additionally produces `guitar` and `piano`. Guitar/piano separation quality is experimental.

On the current CPU-only worker, expect several minutes per song. The script detects CUDA automatically and will use it if an NVIDIA GPU is available.

**Stems are for private analysis only. Do not publish or redistribute separated audio.**

## Audio feature register — `analyze_audio.py`

Reads a six-stem directory created by `separate.py` and produces one compact JSON document per song: drum-derived beat times and estimated tempo, per-stem energy windows, onset counts, spectral-centroid summaries, and a conservative arrangement-energy profile.

```bash
source .venv/bin/activate
python analyze_audio.py /opt/tbhc-pipeline/output/separate --out /opt/tbhc-pipeline/output/audio-analysis
```

The JSON contains machine-generated, signal-derived measurements, not official stems, lyrics, or definitive musicological claims. The public readout is generated from these measurements without human expert interpretation.

## Website data — `build_site_data.py`

Converts the private version-2 analysis JSON into the compact TypeScript dataset used by the Cocktail Bar. The destination file is generated and must never be edited manually.

```bash
source .venv/bin/activate
python build_site_data.py /opt/tbhc-pipeline/output/audio-analysis-v2 \
  --out ../src/data/audioAnalysis.ts
```

The required order is `analyze_audio.py` → `build_site_data.py` → copy or write `src/data/audioAnalysis.ts` into the website checkout → run `npm run lint` and `npm run build` → commit the generated file. Keep analysis JSON, stems, and source media private.

## Output contract

For `song.flac`, the default output is:

```text
out/separate/song/
├── vocals.wav
├── drums.wav
├── bass.wav
└── other.wav
```

Individual failures are appended to `out/separate/errors.log`; remaining files continue. The command exits non-zero only if no input file completed.

## Environment setup

Run the setup script as root or via sudo on Ubuntu 24.04. It can safely be run again.

```bash
sudo bash setup.sh
```

## Vultr runbook

1. Provision an Ubuntu 24.04 instance. A GPU is optional; it speeds up music separation, while video shot analysis is fine on CPU.
2. Clone this repository, enter `tbhc-pipeline`, and run `sudo bash setup.sh`.
3. Activate the environment with `source .venv/bin/activate`.
4. Upload authorised source material: `rsync -avP ./sources/ root@IP:/opt/tbhc-pipeline/incoming/`.
5. Run the tools over `incoming/`; outputs accumulate in `output/` or the `--out` directory you choose.
6. Download structured results: `rsync -avP root@IP:/opt/tbhc-pipeline/output/ ./out/`.
7. Verify results locally, then destroy a temporary instance rather than merely stopping it.

## Music-video structure — `analyze_mv.py`

Automatically detects shots with PySceneDetect, then writes timecodes, five-colour palettes, brightness and saturation measures, three private reference frames per shot, and a palette barcode PNG. These outputs are machine-generated measurements, not cinematographic interpretation.

```bash
source .venv/bin/activate
python analyze_mv.py /opt/tbhc-pipeline/incoming --out /opt/tbhc-pipeline/output/analyze-mv
```

Use `--no-frames` to keep only the JSON and palette barcode. Reference JPEGs are for private analysis and must not be published.

AV1 sources are automatically converted to a private H.264 working copy in `out/analyze-mv/.work/` before analysis, because the worker's OpenCV decoder cannot read AV1 reliably. The working copy is not website data and should remain server-side.
