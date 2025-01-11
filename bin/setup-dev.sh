#!/usr/bin/env bash

set -e

SKIP_PYTHON=${SKIP_PYTHON:-false}

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo "Starting dev setup from ${SCRIPT_DIR}"
pushd "${SCRIPT_DIR}" &> /dev/null

# Setup AWS CLI or prompt user to install it
source ./setup-aws.sh

# Setup Pyenv and install Python version for TOM
if [[ "${SKIP_PYTHON}" == "true" ]]; then
  echo "Skipping Python setup."
else
  source ./setup-python.sh
fi

# Install Postgresql, run local database, and setup dev user
echo "Setting up local PostgreSQL database..."
POSTGRES_LOGIN=$( source ./setup-postgres.sh )
POSTGRES_USER=$( echo "${POSTGRES_LOGIN}" | cut -d ":" -f 1)
POSTGRES_PASSWORD=$( echo "${POSTGRES_LOGIN}" | cut -d ":" -f 2)

# Setup .env
TOM_ROOT=$( cd "${SCRIPT_DIR}/.." && pwd )
echo "# Base environment setup" > "${TOM_ROOT}/.env"
{
  echo "TOM_ROOT=${TOM_ROOT}"
  echo "AWS_PROFILE=dev"
  echo "PYTHON_VERSION=$( python --version | sed 's/Python //g' )"
  echo "PRISMA_SCHEMA_PATH=${TOM_ROOT}/tom-ui/prisma/schema.prisma"
  echo "DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost"
} >> "${TOM_ROOT}/.env"
