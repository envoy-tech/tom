import random

import pytest

from tom.trip_manager import TripManager
from tom.common import S3Params
from tom.common.cloud_access.aws import s3


@pytest.mark.parametrize("make_linear", [False, True])
def test_generate_mps_string(
        small_trip,
        sample_trip_params,
        make_linear
):
    if make_linear:
        num_locations = len(small_trip["locations"])
        small_trip["trip"]["start_location_index"] = random.randint(1, num_locations - 1)
    trip_manager = TripManager(**small_trip)
    mps_string = trip_manager.generate_mps_string(sample_trip_params)
    assert mps_string is not None


def test_save_mps_metadata_to_s3(
        boto3_dev_session,
        small_trip,
        sample_trip_params,
        s3_conn
):
    trip_manager = TripManager(**small_trip)
    s3_object_key = "test_save_mps_metadata_to_s3.mps"
    response = s3.upload_to_s3(
        s3_conn,
        S3Params.BUCKET_NAME,
        "test_save_mps_metadata_to_s3",
        s3_object_key,
        object_metadata=trip_manager.metadata
    )
    assert response is not None
    s3.delete_file_in_s3(
        s3_conn,
        s3_object_key,
        S3Params.BUCKET_NAME
    )


def test_create_with_no_trip(
        small_trip,
        sample_trip_params
):
    small_trip["trip"] = {}
    with pytest.raises(TypeError):
        _ = TripManager(**small_trip)


def test_create_with_no_travelers(
        small_trip,
        sample_trip_params
):
    small_trip["travelers"] = []
    with pytest.raises(ValueError):
        _ = TripManager(**small_trip)


@pytest.mark.parametrize(
    "location_ratings",
    [
        [],
        list(range(5)),
        list(range(-5, 5)),
        list(range(5, 15)),
        ["a" for _ in range(10)],
        [True for _ in range(10)]
    ]
)
def test_create_with_bad_traveler_ratings(
        small_trip,
        sample_trip_params,
        location_ratings
):
    small_trip["travelers"][0]["location_ratings"] = location_ratings
    with pytest.raises((ValueError, TypeError)):
        _ = TripManager(**small_trip)


@pytest.mark.parametrize(
    "desired_time_in_location",
    [
        [],
        list(range(5)),
        list(range(-5, 5)),
        list(range(5, 15)),
        ["a" for _ in range(10)],
        [True for _ in range(10)]
    ]
)
def test_create_with_bad_traveler_desired_times(
        small_trip,
        sample_trip_params,
        desired_time_in_location
):
    small_trip["travelers"][0]["desired_time_in_location"] = desired_time_in_location
    with pytest.raises((ValueError, TypeError)):
        _ = TripManager(**small_trip)


def test_create_with_no_locations(
        small_trip,
        sample_trip_params
):
    small_trip["locations"] = []
    with pytest.raises(ValueError):
        _ = TripManager(**small_trip)


@pytest.mark.parametrize("start_location_index", [None, -1, 100, 4.5, "a", True, False])
def test_create_with_bad_start_location_index(
        small_trip,
        sample_trip_params,
        start_location_index
):
    small_trip["trip"]["start_location_index"] = start_location_index
    with pytest.raises(IndexError):
        _ = TripManager(**small_trip)


@pytest.mark.parametrize("end_location_index", [None, -1, 100, 4.5, "a", True, False])
def test_create_with_bad_end_location_index(
        small_trip,
        sample_trip_params,
        end_location_index
):
    small_trip["trip"]["end_location_index"] = end_location_index
    with pytest.raises(IndexError):
        _ = TripManager(**small_trip)
