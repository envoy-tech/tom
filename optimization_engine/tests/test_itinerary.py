import pytest
import json

from optimization_engine import *


@pytest.mark.parametrize("test_circular", [True, False])
def test_create_itinerary(
        small_trip_circular_mps,
        small_trip_linear_mps,
        test_circular
):

    sample_trip_mps, metadata = small_trip_circular_mps if test_circular else small_trip_linear_mps

    solver = OptimizeMPSData(sample_trip_mps)

    num_locations = int(metadata["num_locations"])
    num_travelers = int(metadata["num_travelers"])
    start_location_id = int(metadata["start_location_id"])
    end_location_id = int(metadata["end_location_id"])
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
                end_location_id,
                start_date
            )
        )
        next_solution = solver.NextSolution()

    assert itineraries

    with open("itineraries.json", "w") as file:
        json.dump(itineraries, file)
