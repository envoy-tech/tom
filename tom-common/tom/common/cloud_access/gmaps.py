import os
import datetime as dt

import googlemaps
import numpy as np
from dotenv import load_dotenv

from tom.common import Env


_ = load_dotenv()
GMAPS_CLIENT = googlemaps.Client(key=os.getenv(Env.GMAPS_API_KEY))


def get_duration_from_gmap_response(response) -> list[float]:
    """Traverse the Google Maps Distance Matrix API response and get the
    duration of travel between locations in hours.

    :param response: the Google Maps Distance Matrix API response
    """
    durations = []
    for row in response["rows"]:
        for element in row["elements"]:
            durations.append(element["duration"]["value"])

    return durations


def create_duration_matrix(
        location_lat_lons: list[tuple[float, float]],
        start_date: dt.datetime,
        params: dict
) -> np.ndarray:

    num_locations = len(location_lat_lons)
    num_elements_to_request = num_locations**2

    if num_elements_to_request <= 100:
        response = GMAPS_CLIENT.distance_matrix(
            location_lat_lons,
            location_lat_lons,
            departure_time=start_date,
            **params
        )
        durations = get_duration_from_gmap_response(response)

    else:
        durations = []
        for lat_lon in location_lat_lons:
            response = GMAPS_CLIENT.distance_matrix(
                lat_lon,
                location_lat_lons,
                departure_time=start_date,
                **params
            )
            durations.extend(get_duration_from_gmap_response(response))

    return np.array(durations).reshape(num_locations, num_locations) / 60**2


def create_timezone_matrix(location_lat_lons: list[tuple[float, float]], start_date: dt.datetime) -> np.ndarray:

    num_locations = len(location_lat_lons)

    timezones = []
    timezone_offsets = np.zeros((num_locations, num_locations))
    for lat_lon in location_lat_lons:
        response = GMAPS_CLIENT.timezone(
            location=lat_lon,
            timestamp=start_date
        )
        timezones.append(response["rawOffset"] // 60**2)

    for i, j in np.ndindex(timezone_offsets.shape):
        timezone_offsets[i, j] = timezones[j] - timezones[i]

    return timezone_offsets
