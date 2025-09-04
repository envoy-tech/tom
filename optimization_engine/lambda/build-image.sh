#!/usr/bin/env bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
echo "Script directory is ${SCRIPT_DIR}"

WHEELS_DIR=${WHEELS_DIR:-${PWD}/../wheels}
echo "Wheels will be pulled from ${WHEELS_DIR}"

# Copy wheels to the build directories
cp -r "${WHEELS_DIR}/" "${SCRIPT_DIR}"

# Create optimization-engine container
docker build --platform linux/amd64 -t optimization-engine "${SCRIPT_DIR}"

# Remove wheels from build directories
rm -rf "${SCRIPT_DIR}/wheels"
