import json

from tom.common import S3Params
from tom.common.cloud_access.aws import s3, sns
from optimization_engine import *
from optimization_engine.itinerary import create_itinerary


class VarName:
    pass


def handler(event, context):

    bucket_name, object_key = s3.parse_s3_event(event)

    # Get the uploaded object from S3
    s3_client = s3.connect_to_s3(S3Params.REGION)
    obj_response = s3_client.get_object(
        Bucket=bucket_name,
        Key=object_key
    )

    trip_mps_body = obj_response["Body"].read().decode("utf-8")
    trip_metadata = json.loads(obj_response["Metadata"]["metadata"])

    # Optimize MPS file data
    solver = OptimizeMPSData(trip_mps_body)

    num_locations = trip_metadata["num_locations"]
    num_travelers = trip_metadata["num_travelers"]

    start_location_id = trip_metadata["start_location_id"]
    start_date = trip_metadata["start_date"]

    itineraries = []
    next_solution = True
    while next_solution:
        itinerary = create_itinerary(
            solver,
            num_locations,
            num_travelers,
            start_location_id,
            start_date,
        )
        itineraries.append(itinerary)
        next_solution = solver.NextSolution()

    return
