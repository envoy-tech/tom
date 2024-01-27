import json
from pathlib import Path

import pytest


def _get_absolute_path(relative_path: str) -> Path:
    return (Path(__file__).parent / relative_path).resolve()


@pytest.fixture(scope="package")
def small_trip_circular_mps() -> str:
    with open(_get_absolute_path("tests/small_trip_circular.mps"), "r") as f:
        sample_mps = f.read()
    return sample_mps


@pytest.fixture(scope="package")
def small_trip_sequential_mps() -> str:
    with open(_get_absolute_path("tests/small_trip_sequential.mps"), "r") as f:
        sample_mps = f.read()
    return sample_mps


@pytest.fixture(scope="package")
def sample_trip_metadata() -> dict:
    with open(_get_absolute_path("tests/test_meta.json"), "r") as f:
        sample_trip_metadata = json.load(f)
    return sample_trip_metadata
