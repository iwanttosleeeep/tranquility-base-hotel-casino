# TBHC Media Pipeline

Small, resumable batch tools for producing structured research data from media that you have permission to process. This directory is not a public web service and does not publish raw media or derived audio.

## Music analysis — `separate.py`

Creates four private Demucs stems (`vocals`, `drums`, `bass`, `other`) from an authorised local audio file or all supported files in a directory. The script is idempotent: a complete existing stem directory prints `SKIP` unless `--force` is supplied.

```bash
source .venv/bin/activate
python separate.py /opt/tbhc-pipeline/incoming/song.flac --out /opt/tbhc-pipeline/output/separate
```

Use `--six` for Demucs' experimental `htdemucs_6s` model, which additionally produces `guitar` and `piano`. Guitar/piano separation quality is experimental.

On the current CPU-only worker, expect several minutes per song. The script detects CUDA automatically and will use it if an NVIDIA GPU is available.

**Stems are for private analysis only. Do not publish or redistribute separated audio.**

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

1. Provision an Ubuntu 24.04 instance. A GPU is optional; it speeds up transcription and separation, while video shot analysis is fine on CPU.
2. Clone this repository, enter `tbhc-pipeline`, and run `sudo bash setup.sh`.
3. Activate the environment with `source .venv/bin/activate`.
4. Upload authorised source material: `rsync -avP ./sources/ root@IP:/opt/tbhc-pipeline/incoming/`.
5. Run the tools over `incoming/`; outputs accumulate in `output/` or the `--out` directory you choose.
6. Download structured results: `rsync -avP root@IP:/opt/tbhc-pipeline/output/ ./out/`.
7. Verify results locally, then destroy a temporary instance rather than merely stopping it.

Transcription and music-video analysis scripts will be added alongside this music tool.
