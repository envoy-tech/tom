# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

from tom.common import common_pb2 as tom_dot_common_dot_common__pb2


class TripManagementStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.BuildTripMPSFile = channel.unary_unary(
                '/tom.TripManagement/BuildTripMPSFile',
                request_serializer=tom_dot_common_dot_common__pb2.TripMPSRequest.SerializeToString,
                response_deserializer=tom_dot_common_dot_common__pb2.TripMPSResponse.FromString,
                )


class TripManagementServicer(object):
    """Missing associated documentation comment in .proto file."""

    def BuildTripMPSFile(self, request, context):
        """*
        Request optimization of a trip.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_TripManagementServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'BuildTripMPSFile': grpc.unary_unary_rpc_method_handler(
                    servicer.BuildTripMPSFile,
                    request_deserializer=tom_dot_common_dot_common__pb2.TripMPSRequest.FromString,
                    response_serializer=tom_dot_common_dot_common__pb2.TripMPSResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'tom.TripManagement', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class TripManagement(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def BuildTripMPSFile(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/tom.TripManagement/BuildTripMPSFile',
            tom_dot_common_dot_common__pb2.TripMPSRequest.SerializeToString,
            tom_dot_common_dot_common__pb2.TripMPSResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
