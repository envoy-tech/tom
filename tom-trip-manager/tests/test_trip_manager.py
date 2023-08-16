from tom.trip_manager.lambda_function import handler


def test_build_trip_mps_file(
        sample_trip,
        mps_folder
):

    handler(sample_trip, {"test-context": "test-context"})
