import os
import yaml

import pytest
import googlemaps
from dotenv import load_dotenv

with open(os.path.join(os.path.dirname(__file__), "tests/sample_trip.yaml"), "r") as f:
    _sample_trip = yaml.safe_load(f)


@pytest.fixture(scope="package")
def env():
    return load_dotenv()


@pytest.fixture(scope="package")
def sample_trip():
    return _sample_trip


@pytest.fixture(scope="package")
def gmaps_client():
    return googlemaps.Client(key=os.getenv("GOOGLE_MAPS_API_KEY"))
