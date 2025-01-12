#!/usr/bin/env bash

set -e

echo "Setting up Node.js environment..."

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
pushd "${SCRIPT_DIR}/.."

TOM_UI_DIR="${TOM_ROOT}/tom-ui"
echo "tom-ui dir is ${TOM_UI_DIR}"

# Install Node Version Manager (NVM)
source "${SCRIPT_DIR}/install-nvm.sh"
