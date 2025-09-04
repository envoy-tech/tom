import json
import asyncio
import logging
from dataclasses import field
from datetime import datetime

from tom.common import S3Params
from tom.common.cloud_access.aws import s3, sns
from tom.common import db as prisma_utils
from optimization_engine import *
from optimization_engine.itinerary import create_itinerary

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class VarName:
    pass

async def async_handler(event, context):

    logger.info(f"Received event: {event}")

    bucket_name, object_key = s3.parse_s3_event(event)
    logger.info(f"Optimizing S3 object: {bucket_name=}, {object_key=}")

    # Get the uploaded object from S3
    s3_client = s3.connect_to_s3(S3Params.REGION)
    obj_response = s3_client.Object(bucket_name, object_key).get()

    trip_mps_body = obj_response["Body"].read().decode("utf-8")
    trip_metadata = obj_response["Metadata"]
    trip_id = trip_metadata["trip_id"]
    logger.info(f"Trip metadata: {trip_metadata}")

    msg = json.dumps({
        "status": {
            "code": sns.TripStatus.OPTIMIZATION_ENGINE_BEGIN.value,
            "msg": sns.TripStatus.OPTIMIZATION_ENGINE_BEGIN.name
        },
        "trip_id": trip_id,
        "traveler_ids": trip_metadata["traveler_ids"],
        "timestamp": datetime.now().isoformat()
    })

    sns_client = sns.get_sns_client()
    sns.publish_to_sns(sns_client, sns.TopicNames.optimization_status, msg)

    # Optimize MPS file data
    try:
        begin_time = datetime.now()
        logger.info("Beginning optimization...")
        # TODO: Add return of solver status here
        solver = OptimizeMPSData(trip_mps_body)
    except Exception as e:
        logger.error("Error encountered during optimization.")
        error_msg = json.dumps({
            "status": {
                "code": sns.TripStatus.OPTIMIZATION_ENGINE_FAILURE.value,
                "name": sns.TripStatus.OPTIMIZATION_ENGINE_FAILURE.name
            },
            "trip_id": trip_id,
            "traveler_ids": trip_metadata["traveler_ids"],
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        })
        sns.publish_to_sns(sns_client, sns.TopicNames.optimization_status, error_msg)
        raise e

    logger.info(f"Optimization complete; duration={datetime.now() - begin_time}")
    num_locations = int(trip_metadata["num_locations"])
    num_travelers = int(trip_metadata["num_travelers"])

    start_location_id = int(trip_metadata["start_location_id"])
    end_location_id = int(trip_metadata["end_location_id"])
    start_date = trip_metadata["start_date"]

    itineraries = []
    next_solution = True
    while next_solution:
        _itinerary = create_itinerary(
            solver,
            num_locations,
            num_travelers,
            start_location_id,
            end_location_id,
            start_date,
        )
        itineraries.append(_itinerary)
        next_solution = solver.NextSolution()

    logging.info(f"Successfully created itineraries: num_itineraries={len(itineraries)}")

    logging.info("Connecting to DB...")
    db = await prisma_utils.connect()
    _ = await prisma_utils.update_trip(
        db,
        trip_id=trip_id,
        field_name="itineraries_json_array",
        data=itineraries
    )

    msg = json.dumps({
        "status": {
            "code": sns.TripStatus.OPTIMIZATION_ENGINE_SUCCESS.value,
            "msg": sns.TripStatus.OPTIMIZATION_ENGINE_SUCCESS.name
        },
        "trip_id": trip_id,
        "traveler_ids": trip_metadata["traveler_ids"],
        "timestamp": datetime.now().isoformat()
    })
    sns.publish_to_sns(sns_client, sns.TopicNames.optimization_status, msg)
    return {"statusCode": 200}


def handler(event, context):
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(async_handler(event, context))
