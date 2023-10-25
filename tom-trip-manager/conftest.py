import os
import json
from pathlib import Path
from functools import cache


import pytest
import googlemaps
from dotenv import load_dotenv

from tom.common import S3Params
from tom.common.cloud_access import aws_access


def _get_absolute_path(relative_path: str) -> Path:
    return(Path(__file__).parent / relative_path).resolve()


@cache
def _read_binary_file(file_path: Path) -> bytes:
    with open(file_path, "rb") as f:
        return f.read()


@pytest.fixture(scope="package")
def env():
    return load_dotenv()


@pytest.fixture(scope="package")
def mps_folder() -> Path:
    return (Path(__file__) / "../../mps_files").resolve()


@pytest.fixture(scope="package")
def sample_trip() -> dict:
    with open(_get_absolute_path("tests/sample_trip2.json"), "r") as f:
        sample_trip = json.load(f)
    return sample_trip


@pytest.fixture(scope="package")
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


@pytest.fixture(scope="package")
def s3():
    return aws_access.connect_to_s3(S3Params.REGION)
