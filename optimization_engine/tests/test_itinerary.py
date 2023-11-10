import json

from optimization_engine import *


def test_create_itinerary(sample_trip_mps, sample_trip_metadata):

    solver = OptimizeMPSData(sample_trip_mps)
    metadata = json.loads(sample_trip_metadata["metadata"])

    num_locations = metadata["num_locations"]
    num_travelers = metadata["num_travelers"]
    start_location_id = metadata["start_location_id"]
    start_date = metadata["start_date"]

    itineraries = []
    next_solution = True
    while next_solution:
        itineraries.append(
            create_itinerary(
                solver,
                num_locations,
                num_travelers,
                start_location_id,
                start_date
            )
        )
        next_solution = solver.NextSolution()

    assert itineraries
