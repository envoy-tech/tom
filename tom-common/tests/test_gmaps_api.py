import datetime as dt

import numpy as np

from tom.common import Location
from tom.common.cloud_access.gmaps import create_duration_matrix
from tom.common.cloud_access.gmaps import create_timezone_matrix


def test_distance_matrix_api(env, gmaps_client, sample_trip, sample_trip_params):

    departure_time = dt.datetime.fromisoformat(sample_trip["trip"]["start_date"])

    locations = [Location(**location) for location in sample_trip["locations"]]

    origins = [location.lat_lon for location in locations]

    duration_matrix = create_duration_matrix(
        location_lat_lons=origins,
        start_date=departure_time,
        params=sample_trip_params
    )

    assert duration_matrix is not None
    assert duration_matrix.shape == (len(locations), len(locations))


def test_timezone_api(env, gmaps_client, sample_trip):

    departure_time = dt.datetime.fromisoformat(sample_trip["trip"]["start_date"])

    locations = [Location(**location) for location in sample_trip["locations"]]
    location_lat_lons = [location.lat_lon for location in locations]

    timezone_matrix = create_timezone_matrix(
        location_lat_lons,
        departure_time
    )

    assert timezone_matrix is not None
    assert timezone_matrix.shape == (len(locations), len(locations))
