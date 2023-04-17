from typing import Union

from google.protobuf.json_format import MessageToDict

from tom.common import common_pb2, Location, Traveler


class LocationFields:
    ID = "location_id"
    NAME = "name"
    ADDRESS = "address"
    LAT = "lat"
    LON = "lon"


class TravelerFields:
    ID = "traveler_id"
    USERNAME = "username"
    EMAIL = "email"
    LOC_RATINGS = "location_ratings"
    DESIRED_STAY = "desired_time_in_location"
    ROAD_THRESH = "road_travel_threshold"
    EARLIEST_START = "earliest_acceptable_start"
    LATEST_END = "latest_acceptable_end"
    START_FLEX = "allowed_start_flexibility"
    END_FLEX = "allowed_end_flexibility"
    ACTIVE_START = "active_stay_start"
    ACTIVE_END = "active_stay_end"


message_to_dict_kwargs = {
        "including_default_value_fields": True,
        "preserving_proto_field_name": True
    }


def parse_location_from_rpc(
        msg: Union[common_pb2.Location, list[common_pb2.Location]]
) -> Union[Location, list[Location]]:
    """ Parse Location gRPC message into Location instance

    :param msg: the :class:`common_pb2.Location` gRPC message or list of such messages
    :return: :class:`Location` instance or list of such instances
    """
    if isinstance(msg, list):
        return [Location(**MessageToDict(loc, **message_to_dict_kwargs)) for loc in msg]
    return Location(**MessageToDict(msg, **message_to_dict_kwargs))


def parse_traveler_from_rpc(
        msg: Union[common_pb2.Traveler, list[common_pb2.Traveler]]
) -> Union[Traveler, list[Traveler]]:
    """ Parse Traveler gRPC message into Traveler instance

    :param msg: the :class:`common_pb2.Traveler` gRPC message
    :return: :class:`Traveler` instance
    """
    if not isinstance(msg, list):
        msg = [msg]

    travelers = []
    for traveler in msg:
        _traveler_dict = MessageToDict(traveler, **message_to_dict_kwargs)
        _traveler_dict[TravelerFields.LOC_RATINGS] = getattr(traveler, TravelerFields.LOC_RATINGS).elements
        _traveler_dict[TravelerFields.DESIRED_STAY] = getattr(traveler, TravelerFields.DESIRED_STAY).elements
        travelers.append(Traveler(**_traveler_dict))

    if len(travelers) == 1:
        return travelers[0]

    return travelers
