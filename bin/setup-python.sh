#!/usr/bin/env bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

pushd "${SCRIPT_DIR}/.."

source "${SCRIPT_DIR}/install-python.sh"
TOM_PYTHON_VENV_NAME="tom-venv-${TOM_PYTHON_VERSION}"

# Initialize Python virtualenv for TOM
pyenv virtualenv -f "${TOM_PYTHON_VERSION}" "${TOM_PYTHON_VENV_NAME}"
pyenv local "${TOM_PYTHON_VENV_NAME}"

# Update pip and pip-tools in virtualenv
python -m pip install --upgrade pip setuptools
pyenv rehash

TOM_PIP_REQUIREMENTS="${SCRIPT_DIR}/requirements.txt"
pip install -r "${TOM_PIP_REQUIREMENTS}"
pyenv rehash

popd