#!/usr/bin/env bash

ENVIRONMENT="${ENVIRONMENT:-dev}"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
echo "Starting ${ENVIRONMENT} deployment from ${SCRIPT_DIR}"

# Source .env.local
LOCAL_ENV=$( realpath "${SCRIPT_DIR}/../../../.env.local" )
if [ -f "${LOCAL_ENV}" ]; then
  echo "Sourcing .env.local from ${LOCAL_ENV}"
  source "${LOCAL_ENV}"
else
  echo "No .env.local detected at ${LOCAL_ENV}; have you run setup-dev.sh from the project root?"
  exit 1
fi

echo "Using AWS profile: ${AWS_PROFILE}"
if ! aws sts get-caller-identity > /dev/null 2>&1; then
  aws sso login --profile "${AWS_PROFILE}"
fi

# Run the remaining commands from the directory where the script resides
pushd "${SCRIPT_DIR}" &> /dev/null

# Get local machines current IP address for RDS whitelist
LOCAL_IP=$( curl -s http://checkip.amazonaws.com )
echo "Current IP address is: ${LOCAL_IP}"

# Create resources with Terraform
terraform init -upgrade -backend-config="../${ENVIRONMENT}-backend.conf"
terraform apply -auto-approve \
  -var="environment=${ENVIRONMENT}" \
  -var="tom_username=${TOM_USERNAME}" \
  -var="local_ip=${LOCAL_IP}"

# Create .env.dev in project root and symlink in tom-ui
DEV_ENV="${TOM_ROOT}/.env.dev"
echo "# Dev environment setup" > "${DEV_ENV}"
python ../update-env.py "${DEV_ENV}" "$(terraform output -json)"
ln -sf "${DEV_ENV}" "${TOM_ROOT}/tom-ui/.env.dev"

popd
