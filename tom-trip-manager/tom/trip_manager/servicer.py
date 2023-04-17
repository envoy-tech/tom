import os
import pathlib
from dotenv import load_dotenv
from configparser import ConfigParser

import grpc
from google.protobuf.json_format import MessageToDict

from tom.common import common_pb2, common_pb2_grpc, grpc_utils, aws_resource_access
from tom.trip_manager.data_objects import Trip


class ConfigSection:
    META = "META"
    CONNECTION = "CONNECTION"
    TLS = "TLS"


class Env:
    GMAPS_API_KEY = "GOOGLE_MAPS_API_KEY"
    S3_ACCESS_KEY_ID = "S3_ACCESS_KEY_ID"
    S3_PRIVATE_KEY = "S3_PRIVATE_KEY"


class S3Params:
    REGION = "us-east-1"
    BUCKET_NAME = "allin-mps-files"


class TripMgmtServicer(common_pb2_grpc.TripManagementServicer):

    def __init__(self, config: ConfigParser):
        self._config = config
        self.tls = dict(config.items(ConfigSection.CONNECTION))
        self._env = load_dotenv()
        if not self._env:
            raise EnvironmentError("Unable to load .env file")

    def BuildTripMPSFile(
            self,
            request: common_pb2.TripMPSRequest,
            context: grpc.RpcContext
    ) -> common_pb2.TripMPSResponse:
        """ Build MPS file for trip's goal program.

        :param request: the request object
        :param context: the context for the request
        :return: a response object containing the session id and a status code
        """
        _session_id = request.session_id
        _trip_args = (
            request.trip_id,
            request.start_date.ToDatetime,
            request.end_date.ToDatetime,
            MessageToDict(request.start_location, **grpc_utils.message_to_dict_kwargs),
            MessageToDict(request.end_location, **grpc_utils.message_to_dict_kwargs),
            os.getenv(Env.GMAPS_API_KEY)
        )
        trip = Trip(*_trip_args)
        trip.add_location(grpc_utils.parse_location_from_rpc(request.locations))
        trip.add_traveler(grpc_utils.parse_traveler_from_rpc(request.travelers))

        _travel_params = MessageToDict(request.travel_params, **grpc_utils.message_to_dict_kwargs)

        mps_filename = trip.generate_mps_file(_travel_params)

        # Verify MPS file was generated
        path_to_mps_folder = pathlib.Path("../../../mps_files")
        path_to_mps_file = path_to_mps_folder / mps_filename

        if not os.path.exists(path_to_mps_file):
            pass  # TODO: Log this error and send back via gRPC

        aws_resource_access.upload_to_s3(
            filepath=path_to_mps_file,
            bucket_name=S3Params.BUCKET_NAME,
            region=S3Params.REGION,
            aws_access_key_id=os.getenv(Env.S3_ACCESS_KEY_ID),
            aws_secret_access_key=os.getenv(Env.S3_PRIVATE_KEY)
        )

        return common_pb2.TripMPSResponse(session_id=_session_id)
