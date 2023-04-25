import os
from pathlib import Path


import pytest
import googlemaps
from dotenv import load_dotenv

from tom.common import aws_resource_access, Env, S3Params


@pytest.fixture(scope="package")
def env():
    return load_dotenv()


@pytest.fixture(scope="package")
def mps_folder() -> Path:
    return (Path(__file__) / "../../mps_files").resolve()


@pytest.fixture(scope="package")
def mps_test_file(mps_folder) -> Path:
    return mps_folder / "test_trip.mps"


@pytest.fixture(scope="package")
def gmaps_client():
    return googlemaps.Client(key=os.getenv("GOOGLE_MAPS_API_KEY"))


@pytest.fixture(scope="package")
def aws_assumed_role():
    return aws_resource_access.assume_role(os.getenv(Env.S3_ACCESS_ARN), os.getenv(Env.S3_ACCESS_ROLE))


@pytest.fixture(scope="package")
def s3(aws_assumed_role):
    return aws_resource_access.connect_to_s3(S3Params.REGION, aws_assumed_role)
