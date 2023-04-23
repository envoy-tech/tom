import os
import uuid
import datetime as dt

import grpc
from google.protobuf import timestamp_pb2

from tom.common import common_pb2, S3Params
from tom.trip_manager.servicer import TripMgmtServicer
from tom.common import aws_resource_access


def test_build_trip_mps_file(
        trip_manager_default_config,
        sample_trip,
        sample_trip_params,
        mps_folder,
        env,
        s3,
        mocker
):

    mocker.patch("grpc.ServicerContext")

    start_date_dt = dt.datetime.strptime(sample_trip["trip"]["start_date"], "%m/%d/%Y")
    end_date_dt = dt.datetime.strptime(sample_trip["trip"]["end_date"], "%m/%d/%Y")

    start_date_ts = timestamp_pb2.Timestamp()
    start_date_ts.FromDatetime(start_date_dt)
    end_date_ts = timestamp_pb2.Timestamp()
    end_date_ts.FromDatetime(end_date_dt)

    start_location = common_pb2.Location(
        **sample_trip["trip"]["start_location"]
    )
    end_location = common_pb2.Location(
        **sample_trip["trip"]["end_location"]
    )

    locations = [
        common_pb2.Location(**location) for location in sample_trip["locations"]
    ]

    travelers = []
    for traveler in sample_trip["travelers"]:
        traveler["location_ratings"] = common_pb2.Vector(elements=traveler["location_ratings"])
        traveler["desired_time_in_location"] = common_pb2.Vector(elements=traveler["desired_time_in_location"])
        travelers.append(common_pb2.Traveler(**traveler))

    params = common_pb2.TravelParams(**sample_trip_params)

    servicer = TripMgmtServicer(trip_manager_default_config)

    trip_id = sample_trip["trip"]["_id"]

    request = common_pb2.TripMPSRequest(
        session_id=str(uuid.uuid4()),
        trip_id=trip_id,
        start_date=start_date_ts,
        end_date=end_date_ts,
        start_location=start_location,
        end_location=end_location,
        locations=locations,
        travelers=travelers,
        travel_params=params
    )

    mps_filename = "{}.mps".format(trip_id)
    response = servicer.BuildTripMPSFile(request, grpc.ServicerContext())
    assert response.session_id == request.session_id
    mps_file = mps_folder / mps_filename
    assert os.path.exists(mps_file)
    os.remove(mps_file)

    assert aws_resource_access.verify_file_in_s3(s3, mps_filename, S3Params.BUCKET_NAME)

    aws_resource_access.delete_file_in_s3(s3, mps_filename, S3Params.BUCKET_NAME)
