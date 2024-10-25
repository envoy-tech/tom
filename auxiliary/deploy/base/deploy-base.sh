#!/usr/bin/env bash

set -e

AWS_PROFILE="${AWS_PROFILE:-dev}"
echo "Using AWS profile: ${AWS_PROFILE}"

if ! aws sts get-caller-identity > /dev/null 2>&1;
then
  aws sso login --profile "${AWS_PROFILE}"
fi

set -exu

ENVIRONMENT="${ENVIRONMENT:-dev}"
echo "Deploying ${ENVIRONMENT} infrastructure"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

# Run the remaining commands from the directory where the script resides
pushd "${SCRIPT_DIR}"

# Create resources with Terraform
terraform init -upgrade -backend-config="${ENVIRONMENT}-backend.conf"
terraform apply -auto-approve \
  -var="environment=${ENVIRONMENT}"

ENV_PATH="${SCRIPT_DIR}/../../../.env"
python ../update_env.py "${ENV_PATH}" "$(terraform output -json)"
