import json
import logging
from datetime import datetime

from tom.common import S3Params
from tom.common.cloud_access.aws import s3, sns
from tom.trip_manager import TripManager

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def handler(event, context):

    logger.info(f"Received event: {event}")

    trip_params = {
        "avoid": "tolls",
        "mode": "driving",
        "units": "imperial",
        "traffic_model": "best_guess"
    }

    logger.info(f"GoogleMaps DistanceMatrix Params: {trip_params}")

    trip = TripManager(**event)

    logger.info(f"TripManager Created: {trip.encode()}")

    msg = json.dumps({
        "status": {
            "code": sns.TripStatus.TRIP_MANAGER_BEGIN.value,
            "msg": sns.TripStatus.TRIP_MANAGER_BEGIN.name
        },
        "trip_id": trip.id,
        "trip_owner_id": trip.trip_owner.id,
        "traveler_ids": [traveler.id for traveler in trip.travelers],
        "timestamp": datetime.now().isoformat()
    })

    sns_client = sns.get_sns_client()
    sns.publish_to_sns(
        sns_client,
        sns.TopicNames.optimization_status,
        msg
    )

    try:
        mps_string = trip.generate_mps_string(trip_params)
        mps_object_key = "{}.mps".format(trip.id)

        s3_conn = s3.connect_to_s3(S3Params.REGION)
        response = s3.upload_to_s3(
            s3_conn,
            S3Params.BUCKET_NAME,
            mps_string,
            mps_object_key,
            object_metadata=trip.metadata
        )
        logger.info(f"MPS file uploaded to S3: {response}")
        msg = json.dumps({
            "status": {
                "code": sns.TripStatus.TRIP_MANAGER_SUCCESS.value,
                "name": sns.TripStatus.TRIP_MANAGER_SUCCESS.name
            },
            "trip_id": trip.id,
            "trip_owner_id": trip.trip_owner.id,
            "timestamp": datetime.now().isoformat()
        })
        sns.publish_to_sns(sns_client, sns.TopicNames.optimization_status, msg)

    except Exception as e:
        error_msg = json.dumps({
            "status": {
                "code": sns.TripStatus.TRIP_MANAGER_FAILURE.value,
                "name": sns.TripStatus.TRIP_MANAGER_FAILURE.name
            },
            "trip_id": trip.id,
            "trip_owner_id": trip.trip_owner.id,
            "timestamp": datetime.now().isoformat(),
            "error": str(e),
        })

        sns.publish_to_sns(sns_client, sns.TopicNames.optimization_status, error_msg)
        raise e

    return
