from tom.common import S3Params
from tom.common.accessor import aws_access
from tom.trip_manager import TripManager


def handler(event, context):

    trip_params = {
        "avoid": "tolls",
        "mode": "driving",
        "units": "imperial",
        "traffic_model": "best_guess"
    }

    trip = TripManager(**event)
    mps_string = trip.generate_mps_file(trip_params)

    mps_object_key = "{}.mps".format(trip.id)

    metadata = {
        "trip_id": str(trip.id),
        "start_date": str(trip.start_date),
        "end_date": str(trip.end_date),
        "start_location_id": str(trip.start_location_index),
        "end_location_id": str(trip.end_location_index),
        "locations": str([location.name for location in trip.locations])
    }

    s3 = aws_access.connect_to_s3(S3Params.REGION)
    response = aws_access.upload_to_s3(s3, S3Params.BUCKET_NAME, mps_string, mps_object_key, object_metadata=metadata)

    return {"status": response.archive_status}
