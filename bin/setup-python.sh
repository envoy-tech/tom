#!/usr/bin/env bash

set -e

echo "Setting up Python virtual environment..."

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

pushd "${SCRIPT_DIR}/.."

source "${SCRIPT_DIR}/install-python.sh"
TOM_PYTHON_VENV_NAME="tom-venv-${TOM_PYTHON_VERSION}"

# Remove existing virtualenv for TOM
if [ -f .python-version ]; then
  echo "Removing existing Python virtualenv for TOM..."
  pyenv virtualenv-delete -f "${TOM_PYTHON_VENV_NAME}"
  rm -f .python-version
fi

# Initialize Python virtualenv for TOM
pyenv virtualenv -f "${TOM_PYTHON_VERSION}" "${TOM_PYTHON_VENV_NAME}"
pyenv local "${TOM_PYTHON_VENV_NAME}"

# Update pip and pip-tools in virtualenv
python -m pip install -U pip setuptools
pyenv rehash

TOM_PIP_REQUIREMENTS="${SCRIPT_DIR}/requirements.txt"
pip install -r "${TOM_PIP_REQUIREMENTS}"
pyenv rehash

popd