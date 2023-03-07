import os
import datetime as dt

import googlemaps
import numpy as np

from tom.data_objects import Location


def test_distance_matrix_api(env, sample_trip):
    
    gmaps = googlemaps.Client(key=os.getenv("GOOGLE_MAPS_API_KEY"))

    departure_time = dt.datetime.strptime(sample_trip["trip"]["start_date"], "%m/%d/%Y")

    locations = [Location(**location) for location in sample_trip["locations"]]

    num_locations = len(locations)

    origins = [location.lat_lon for location in locations]
    destinations = origins.copy()

    maps_response = gmaps.distance_matrix(
                            origins,
                            destinations,
                            avoid="tolls",
                            mode="driving",
                            units="imperial",
                            departure_time=departure_time,
                            traffic_model="best_guess"
                    )

    distance, duration = [], []
    
    for row in maps_response["rows"]:
        for element in row["elements"]:
            distance.append(element["distance"]["value"])
            duration.append(element["duration"]["value"])

    distance = np.array(distance).reshape(num_locations, num_locations)
    duration = np.array(distance).reshape(num_locations, num_locations)

    assert distance.any() and duration.any()
