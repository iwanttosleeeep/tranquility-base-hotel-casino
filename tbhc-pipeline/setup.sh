#!/usr/bin/env bash
set -euo pipefail

# Safe to re-run. Run as root or through sudo on Ubuntu 24.04.
if [[ "${EUID}" -ne 0 ]]; then
  echo "Please run with sudo: sudo bash setup.sh"
  exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="${SCRIPT_DIR}/.venv"

apt-get update
apt-get install -y ffmpeg python3-venv python3-pip build-essential libsndfile1

if [[ ! -x "${VENV_DIR}/bin/python" ]]; then
  python3 -m venv "${VENV_DIR}"
fi

"${VENV_DIR}/bin/python" -m pip install --upgrade pip wheel

if command -v nvidia-smi >/dev/null 2>&1 && nvidia-smi >/dev/null 2>&1; then
  echo "CUDA-capable NVIDIA GPU detected; installing CUDA PyTorch."
  "${VENV_DIR}/bin/python" -m pip install --upgrade torch torchaudio --index-url https://download.pytorch.org/whl/cu124
else
  echo "No usable NVIDIA GPU detected; installing CPU PyTorch."
  "${VENV_DIR}/bin/python" -m pip install --upgrade torch torchaudio --index-url https://download.pytorch.org/whl/cpu
fi

"${VENV_DIR}/bin/python" -m pip install -r "${SCRIPT_DIR}/requirements.txt"
mkdir -p "${SCRIPT_DIR}/out" "${SCRIPT_DIR}/in"
echo "TBHC pipeline environment ready: ${VENV_DIR}"
