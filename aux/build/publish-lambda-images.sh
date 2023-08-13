#!/usr/bin/env bash

set -e

AWS_PROFILE=${AWS_PROFILE:-dev}
echo "Using AWS profile ${AWS_PROFILE}"

TRIP_MANAGER_TAG=${TRIP_MANAGER_TAG:-latest}
echo "Using trip-manager tag ${TRIP_MANAGER_TAG}"

aws ecr get-login-password --region us-east-1 --profile "${AWS_PROFILE}" \
  | docker login --username AWS --password-stdin 786929059663.dkr.ecr.us-east-1.amazonaws.com

docker tag trip-manager:"${TRIP_MANAGER_TAG}" 786929059663.dkr.ecr.us-east-1.amazonaws.com/trip-manager:"${TRIP_MANAGER_TAG}"
docker push 786929059663.dkr.ecr.us-east-1.amazonaws.com/trip-manager:"${TRIP_MANAGER_TAG}"
