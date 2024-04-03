import os
import json
from pathlib import Path
from functools import cache

import boto3
import pytest
import googlemaps
from dotenv import load_dotenv

from tom.common import S3Params
from tom.common.cloud_access.aws import s3


def _get_absolute_path(relative_path: str) -> Path:
    return (Path(__file__).parent / relative_path).resolve()


@cache
def _read_binary_file(file_path: Path) -> bytes:
    with open(file_path, "rb") as f:
        return f.read()


@pytest.fixture(scope="package")
def env():
    return load_dotenv()


@pytest.fixture(scope="function")
def sample_trip() -> dict:
    with open(_get_absolute_path("trips/sample_trip2.json"), "r") as f:
        sample_trip = json.load(f)
    return sample_trip


@pytest.fixture(scope="function")
def sample_trip_params() -> dict:
    _params = {
        "avoid": "tolls",
        "mode": "driving",
        "units": "imperial",
        "traffic_model": "best_guess"
    }
    return _params


@pytest.fixture(scope="package")
def gmaps_client():
    return googlemaps.Client(key=os.getenv("GOOGLE_MAPS_API_KEY"))


@pytest.fixture(scope="function")
def small_trip() -> dict:
    with open(_get_absolute_path("trips/small_trip.json"), "r") as f:
        trip = json.load(f)
    return trip


@pytest.fixture(scope="function")
def large_trip() -> dict:
    with open(_get_absolute_path("trips/large_trip.json"), "r") as f:
        trip = json.load(f)
    return trip


@pytest.fixture(scope="function")
def subtour_trip() -> dict:
    with open(_get_absolute_path("trips/subtour_trip.json"), "r") as f:
        subtour_trip = json.load(f)
    return subtour_trip


@pytest.fixture(scope="package")
def boto3_dev_session(env):
    boto3.setup_default_session(profile_name=os.getenv("AWS_PROFILE"))


@pytest.fixture(scope="package")
def s3_conn():
    return s3.connect_to_s3(S3Params.REGION)


@pytest.fixture(scope="function")
def small_trip_circular_mps() -> tuple[str, dict]:
    with open(_get_absolute_path("trips/small_trip_circular.mps"), "r") as f:
        sample_mps = f.read()
    with open(_get_absolute_path("trips/small_trip_circular_metadata.json"), "r") as f:
        sample_metadata = json.load(f)

    return sample_mps, sample_metadata


@pytest.fixture(scope="function")
def small_trip_linear_mps() -> tuple[str, dict]:
    with open(_get_absolute_path("trips/small_trip_linear.mps"), "r") as f:
        sample_mps = f.read()
    with open(_get_absolute_path("trips/small_trip_linear_metadata.json"), "r") as f:
        sample_metadata = json.load(f)

    return sample_mps, sample_metadata
