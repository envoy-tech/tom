import json

from tom.common import S3Params
from tom.common.cloud_access.aws import s3, sns
from tom.trip_manager import TripManager


def handler(event, context):

    trip_params = {
        "avoid": "tolls",
        "mode": "driving",
        "units": "imperial",
        "traffic_model": "best_guess"
    }

    trip = TripManager(**event)

    msg = json.dumps({
        "status": sns.TripStatus.TRIP_MANAGER_BEGIN.value,
        "trip_id": trip.id,
        "trip_owner_id": trip.trip_owner.id
    })

    sns_client = sns.get_sns_client()
    _ = sns.publish_to_sns(
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
        msg = json.dumps({
            "status": sns.TripStatus.TRIP_MANAGER_SUCCESS.value,
            "trip_id": trip.id,
            "trip_owner_id": trip.trip_owner.id
        })
        _ = sns.publish_to_sns(
            sns_client,
            sns.TopicNames.optimization_status,
            msg
        )

    except Exception as e:
        error_msg = json.dumps({
            "status": sns.TripStatus.TRIP_MANAGER_FAILURE.value,
            "trip_id": trip.id,
            "trip_owner_id": trip.trip_owner.id,
            "error": str(e)
        })

        _ = sns.publish_to_sns(
            sns_client,
            sns.TopicNames.optimization_status,
            error_msg
        )

        raise e

    return {"status": response.archive_status}
