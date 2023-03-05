import pytest

from tom.data_objects import Trip


@pytest.mark.slow
def test_optimize_trip(sample_trip: dict):

    trip = Trip.load_from_dict(sample_trip)
    solver = trip.optimize()
    assert True
