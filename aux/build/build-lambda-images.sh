#!/usr/bin/env bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
source "${SCRIPT_DIR}/../../.env"

WHEELS_DIR=${WHEELS_DIR:-${PWD}/wheels}
echo "Wheels will be pulled from ${WHEELS_DIR}"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
echo "Script directory is ${SCRIPT_DIR}"

# Copy wheels to the build directories
cp -r "${WHEELS_DIR}/" "${SCRIPT_DIR}/trip-manager"
cp -r "${WHEELS_DIR}/" "${SCRIPT_DIR}/optimization-engine"

# Create trip-manager container
docker build -t trip-manager --build-arg GOOGLE_MAPS_API_KEY="${GOOGLE_MAPS_API_KEY}" "${SCRIPT_DIR}/trip-manager"

# Remove wheels from build directories
rm -rf "${SCRIPT_DIR}/trip-manager/wheels"
rm -rf "${SCRIPT_DIR}/optimization-engine/wheels"
