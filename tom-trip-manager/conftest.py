import os
import json
import random
from pathlib import Path
from functools import cache


import configparser
import pytest
import googlemaps
from dotenv import load_dotenv

from tom.common.configuration.loader import parse_config
from tom.common import aws_resource_access, Env, S3Params


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
    with open(_get_absolute_path("tests/sample_trip2.yaml"), "r") as f:
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
def aws_assumed_role(env):
    return aws_resource_access.assume_role(os.getenv(Env.S3_ACCESS_ARN), os.getenv(Env.S3_ACCESS_ROLE))


@pytest.fixture(scope="package")
def s3(aws_assumed_role):
    return aws_resource_access.connect_to_s3(S3Params.REGION, aws_assumed_role)


@pytest.fixture(scope="package")
def trip_manager_hostname() -> str:
    return "localhost"


@pytest.fixture(scope="package")
def trip_manager_port_number() -> int:
    return random.randint(2**9, 2**15 - 1) * 2
