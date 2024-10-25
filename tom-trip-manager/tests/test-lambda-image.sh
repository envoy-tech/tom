#!/usr/bin/env bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
echo "Script directory is ${SCRIPT_DIR}"
ENV_FILE="${SCRIPT_DIR}/../../.env"
source "${ENV_FILE}"

AWS_DEFAULT_PROFILE=${AWS_DEFAULT_PROFILE:-dev}
echo "Using AWS profile ${AWS_DEFAULT_PROFILE}"

TRIP_MANAGER_TAG=${TRIP_MANAGER_TAG:-latest}
echo "Using trip-manager tag ${TRIP_MANAGER_TAG}"

CONTAINER_NAME="trip-manager-test"

docker run \
  -d \
  --name "${CONTAINER_NAME}" \
  -p 9000:8080 \
  -e AWS_DEFAULT_PROFILE="${AWS_DEFAULT_PROFILE}" \
  --env-file "${ENV_FILE}" \
  -v "${HOME}/.aws/:/root/.aws" \
  trip-manager:"${TRIP_MANAGER_TAG}"

curl "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d @"${SCRIPT_DIR}/../../trips/small_trip.json" \
  -H "Content-Type: application/json"; echo

docker kill "${CONTAINER_NAME}" &> /dev/null
docker rm "${CONTAINER_NAME}" &> /dev/null
