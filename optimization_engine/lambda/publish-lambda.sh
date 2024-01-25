#!/usr/bin/env bash

set -e

CONTAINER_NAME=${CONTAINER_NAME:-optimization-engine}
CONTAINER_TAG=${CONTAINER_TAG:-latest}
echo "Using container ${CONTAINER_NAME}:${CONTAINER_TAG}"

ECR_URL="786929059663.dkr.ecr.us-east-1.amazonaws.com"
echo "Using ECR URL ${ECR_URL}"

ECR_URI="${ECR_URL}/${CONTAINER_NAME}:${CONTAINER_TAG}"

LAMBDA_NAME=${LAMBDA_NAME:-optimization-engine-dev}
echo "Updating lambda function: ${LAMBDA_NAME}"

AWS_DEFAULT_PROFILE=${AWS_DEFAULT_PROFILE:-dev}
echo "Using AWS profile ${AWS_DEFAULT_PROFILE}"

aws lambda update-function-code \
  --function-name "${LAMBDA_NAME}" \
  --image-uri "${ECR_URI}" \
  --publish \
  --profile "${AWS_DEFAULT_PROFILE}"
