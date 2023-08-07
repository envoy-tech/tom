import os

from tom.trip_manager import TripManager


def test_build_trip_mps_file(
        sample_trip,
        sample_trip_params,
        mps_folder,
        env
):

    trip = TripManager(**sample_trip)
    trip.generate_mps_file(sample_trip_params)

    mps_filename = "{}.mps".format(trip.id)
    mps_file = mps_folder / mps_filename
    assert os.path.exists(mps_file)
    os.remove(mps_file)
