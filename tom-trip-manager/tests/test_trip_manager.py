from tom.trip_manager import TripManager


def test_build_trip_mps_file(
        sample_trip,
        sample_trip_params
):
    trip_manager = TripManager(**sample_trip)
    mps_string = trip_manager.generate_mps_string(sample_trip_params)
    assert mps_string is not None
