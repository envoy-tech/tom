import json
from pathlib import Path

import pytest


def _get_absolute_path(relative_path: str) -> Path:
    return (Path(__file__).parent / relative_path).resolve()


@pytest.fixture(scope="package")
def small_trip_circular_mps() -> tuple[str, dict]:
    with open(_get_absolute_path("tests/small_trip_circular.mps"), "r") as f:
        sample_mps = f.read()
    with open(_get_absolute_path("tests/small_trip_circular_metadata.json"), "r") as f:
        sample_trip_metadata = json.load(f)

    return sample_mps, sample_trip_metadata


@pytest.fixture(scope="package")
def small_trip_linear_mps() -> tuple[str, dict]:
    with open(_get_absolute_path("tests/small_trip_linear.mps"), "r") as f:
        sample_mps = f.read()
    with open(_get_absolute_path("tests/small_trip_linear_metadata.json"), "r") as f:
        sample_trip_metadata = json.load(f)

    return sample_mps, sample_trip_metadata
