#!/usr/bin/env bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
echo "Script directory is ${SCRIPT_DIR}"
source "${SCRIPT_DIR}/../../.env"

WHEELS_DIR=${WHEELS_DIR:-${PWD}/../wheels}
echo "Wheels will be pulled from ${WHEELS_DIR}"

# Copy wheels to the build directories
cp -r "${WHEELS_DIR}/" "${SCRIPT_DIR}"

# Login to docker
aws ecr get-login-password --region us-east-1 --profile "${AWS_PROFILE}" \
  | docker login --username AWS --password-stdin "${BUILD_ECR_URL}"

# Create optimization-engine container
docker build --platform linux/amd64 -t optimization-engine "${SCRIPT_DIR}"

# Remove wheels from build directories
rm -rf "${SCRIPT_DIR}/wheels"
