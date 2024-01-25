#!/usr/bin/env bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
echo "Script directory is ${SCRIPT_DIR}"
ENV_FILE="${SCRIPT_DIR}/../../.env"
source "${ENV_FILE}"

AWS_DEFAULT_PROFILE=${AWS_DEFAULT_PROFILE:-dev}
echo "Using AWS profile ${AWS_DEFAULT_PROFILE}"

OPTIMIZATION_ENGINE_TAG=${OPTIMIZATION_ENGINE_TAG:-latest}
echo "Using optimization-engine tag ${OPTIMIZATION_ENGINE_TAG}"

CONTAINER_NAME="optimization-engine-test"

docker run \
  --platform linux/amd64 \
  -d \
  --name "${CONTAINER_NAME}" \
  -p 9000:8080 \
  -e AWS_DEFAULT_PROFILE="${AWS_DEFAULT_PROFILE}" \
  --env-file "${ENV_FILE}" \
  -v "${HOME}/.aws/:/root/.aws" \
  -v ~/.aws-lambda-rie:/aws-lambda \
  --entrypoint /aws-lambda/aws-lambda-rie \
  optimization-engine:"${OPTIMIZATION_ENGINE_TAG}" \
    /function/oe-venv-3.10.5/bin/python3.10 -m awslambdaric lambda_function.handler

curl "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d @"${SCRIPT_DIR}/sample_s3_put.json" \
  -H "Content-Type: application/json"; echo

docker kill "${CONTAINER_NAME}" &> /dev/null
docker rm "${CONTAINER_NAME}" &> /dev/null
