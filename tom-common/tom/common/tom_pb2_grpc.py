# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

from tom.common import tom_pb2 as tom_dot_common_dot_tom__pb2


class GoogleMapsStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.GetDistanceMatrix = channel.unary_unary(
                '/tom.GoogleMaps/GetDistanceMatrix',
                request_serializer=tom_dot_common_dot_tom__pb2.DistanceMatrixRequest.SerializeToString,
                response_deserializer=tom_dot_common_dot_tom__pb2.DistanceMatrixResponse.FromString,
                )
        self.GetTimeZone = channel.unary_unary(
                '/tom.GoogleMaps/GetTimeZone',
                request_serializer=tom_dot_common_dot_tom__pb2.TimeZoneRequest.SerializeToString,
                response_deserializer=tom_dot_common_dot_tom__pb2.TimeZoneResponse.FromString,
                )


class GoogleMapsServicer(object):
    """Missing associated documentation comment in .proto file."""

    def GetDistanceMatrix(self, request, context):
        """*
        Return a distance matrix for inputted locations from GoogleMaps.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetTimeZone(self, request, context):
        """*
        Return timezones for each inputted location from GoogleMaps.
        """
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_GoogleMapsServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'GetDistanceMatrix': grpc.unary_unary_rpc_method_handler(
                    servicer.GetDistanceMatrix,
                    request_deserializer=tom_dot_common_dot_tom__pb2.DistanceMatrixRequest.FromString,
                    response_serializer=tom_dot_common_dot_tom__pb2.DistanceMatrixResponse.SerializeToString,
            ),
            'GetTimeZone': grpc.unary_unary_rpc_method_handler(
                    servicer.GetTimeZone,
                    request_deserializer=tom_dot_common_dot_tom__pb2.TimeZoneRequest.FromString,
                    response_serializer=tom_dot_common_dot_tom__pb2.TimeZoneResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'tom.GoogleMaps', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class GoogleMaps(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def GetDistanceMatrix(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/tom.GoogleMaps/GetDistanceMatrix',
            tom_dot_common_dot_tom__pb2.DistanceMatrixRequest.SerializeToString,
            tom_dot_common_dot_tom__pb2.DistanceMatrixResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def GetTimeZone(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/tom.GoogleMaps/GetTimeZone',
            tom_dot_common_dot_tom__pb2.TimeZoneRequest.SerializeToString,
            tom_dot_common_dot_tom__pb2.TimeZoneResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
