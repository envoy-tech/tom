import os
from pathlib import Path
from dotenv import load_dotenv
from configparser import ConfigParser

import grpc
from google.protobuf.json_format import MessageToDict

from tom.common import (
    common_pb2,
    common_pb2_grpc,
    grpc_utils,
    aws_resource_access,
    Env,
    S3Params
)
from tom.trip_manager.data_objects import Trip


class ConfigSection:
    META = "META"
    CONNECTION = "CONNECTION"
    TLS = "TLS"


class TripMgmtServicer(common_pb2_grpc.TripManagementServicer):

    MPS_FOLDER = (Path(__file__) / "../../../../mps_files").resolve()

    def __init__(self, config: ConfigParser):
        self._config = config
        self.tls = dict(config.items(ConfigSection.CONNECTION))
        self._env = load_dotenv()
        if not self._env:
            raise EnvironmentError("Unable to load .env file")
        self._role = aws_resource_access.assume_role(
            os.getenv(Env.S3_ACCESS_ARN),
            os.getenv(Env.S3_ACCESS_ROLE)
        )
        self._s3 = aws_resource_access.connect_to_s3(
            S3Params.REGION,
            self._role
        )

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
            request.start_date.ToDatetime(),
            request.end_date.ToDatetime(),
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
        path_to_mps_file = self.MPS_FOLDER / mps_filename

        if not os.path.exists(path_to_mps_file):
            pass  # TODO: Log this error and send back via gRPC

        aws_resource_access.upload_to_s3(self._s3, path_to_mps_file, S3Params.BUCKET_NAME)

        return common_pb2.TripMPSResponse(session_id=_session_id)
