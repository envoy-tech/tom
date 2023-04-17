from configparser import ConfigParser

import grpc
from google.protobuf.json_format import MessageToDict

from tom.common import common_pb2, common_pb2_grpc, grpc_utils
from tom.trip_manager.data_objects import Trip


class ConfigSections:
    META = "META"
    CONNECTION = "CONNECTION"
    TLS = "TLS"


class TripMgmtServicer(common_pb2_grpc.TripManagementServicer):

    def __init__(self, config: ConfigParser):
        self._config = config
        self.tls = dict(config.items(ConfigSections.CONNECTION))

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
            MessageToDict(request.end_location, **grpc_utils.message_to_dict_kwargs)
        )
        trip = Trip(*_trip_args)
        trip.add_location(grpc_utils.parse_location_from_rpc(request.locations))
        trip.add_traveler(grpc_utils.parse_traveler_from_rpc(request.travelers))

        _travel_params = MessageToDict(request.travel_params, **grpc_utils.message_to_dict_kwargs)

        trip.generate_mps_file(_travel_params)








