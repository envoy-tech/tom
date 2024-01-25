#!/usr/bin/env bash

set -e

AWS_PROFILE=${AWS_PROFILE:-dev}
echo "Using AWS profile ${AWS_PROFILE}"

CONTAINER_NAME=${CONTAINER_NAME:-optimization-engine}
echo "Using container name ${CONTAINER_NAME}"

CONTAINER_TAG=${CONTAINER_TAG_TAG:-latest}
echo "Using container tag ${CONTAINER_TAG}"

ECR_URL="786929059663.dkr.ecr.us-east-1.amazonaws.com"
echo "Using ECR URL ${ECR_URL}"

ECR_URI="${ECR_URL}/${CONTAINER_NAME}:${CONTAINER_TAG}"

aws ecr get-login-password --region us-east-1 --profile "${AWS_PROFILE}" \
  | docker login --username AWS --password-stdin "${ECR_URL}"

docker tag "${CONTAINER_NAME}:${CONTAINER_TAG}" "${ECR_URI}"
docker push "${ECR_URI}"
