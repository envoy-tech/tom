#!/usr/bin/env bash

set -e

REMAKE_ENV=${REMAKE_ENV:-true}
SKIP_AWS=${SKIP_AWS:-false}
SKIP_PYTHON=${SKIP_PYTHON:-false}
SKIP_NODE=${SKIP_NODE:-false}
SKIP_POSTGRES=${SKIP_POSTGRES:-false}

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo "Starting dev setup from ${SCRIPT_DIR}"
pushd "${SCRIPT_DIR}" &> /dev/null

# Begin .env setup
TOM_ROOT=$( cd "${SCRIPT_DIR}/.." && pwd )
ENV_FILE="${TOM_ROOT}/.env"

# Setup AWS CLI or prompt user to install it
if [[ "${SKIP_AWS}" == "true" ]]; then
  echo "Skipping AWS setup"
else
  source ./setup-aws.sh
fi

# Setup Pyenv and install Python version for TOM
if [[ "${SKIP_PYTHON}" == "true" ]]; then
  echo "Skipping Python setup"
else
  source ./setup-python.sh
fi

# Setup NVM and install Node version for TOM UI
if [[ "${SKIP_NODE}" == "true" ]]; then
  echo "Skipping Node setup"
else
  source ./setup-node.sh
fi

POSTGRES_USER=${POSTGRES_USER:-dev}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-default}
POSTGRES_VERSION=${POSTGRES_VERSION:-14}
POSTGRES_CLUSTER=${POSTGRES_CLUSTER:-dev}
# Install Postgresql, run local database, and setup dev user
if [[ "${SKIP_POSTGRES}" == "true" ]]; then
  echo "Skipping Postgres setup"
else
  source ./setup-postgres.sh "${POSTGRES_USER}" "${POSTGRES_PASSWORD}" "${POSTGRES_VERSION}" "${POSTGRES_CLUSTER}"
fi

# Setup .env
if [ "${REMAKE_ENV}" == "true" ]; then
  echo "# Base environment setup" > "${ENV_FILE}"
  {
    echo "TOM_ROOT=${TOM_ROOT}"
    echo "AWS_PROFILE=dev"
    echo "PYTHON_VERSION=$( python --version | sed 's/Python //g' )"
    echo "PRISMA_SCHEMA_PATH=${TOM_ROOT}/tom-ui/prisma/schema.prisma"
    echo "DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost"
  } >> "${ENV_FILE}"
fi

# Reload shell to finalize Node version install via NVM
ln -sf "${TOM_ROOT}/.env" "${TOM_ROOT}/tom-ui/.env"
popd &> /dev/null

if [[ "${SKIP_NODE}" == "false" ]]; then
  exec ${SHELL}
fi

