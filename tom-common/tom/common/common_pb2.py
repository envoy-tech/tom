# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: tom/common/common.proto
"""Generated protocol buffer code."""
from google.protobuf.internal import builder as _builder
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from google.protobuf import timestamp_pb2 as google_dot_protobuf_dot_timestamp__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x17tom/common/common.proto\x12\x03tom\x1a\x1fgoogle/protobuf/timestamp.proto\"\xcd\x02\n\x0eTripMPSRequest\x12\x12\n\nsession_id\x18\x01 \x01(\t\x12\x0f\n\x07trip_id\x18\x02 \x01(\t\x12.\n\nstart_date\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12,\n\x08\x65nd_date\x18\x04 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\x12%\n\x0estart_location\x18\x05 \x01(\x0b\x32\r.tom.Location\x12#\n\x0c\x65nd_location\x18\x06 \x01(\x0b\x32\r.tom.Location\x12 \n\tlocations\x18\x07 \x03(\x0b\x32\r.tom.Location\x12 \n\ttravelers\x18\x08 \x03(\x0b\x32\r.tom.Traveler\x12(\n\rtravel_params\x18\t \x01(\x0b\x32\x11.tom.TravelParams\"%\n\x0fTripMPSResponse\x12\x12\n\nsession_id\x18\x01 \x01(\t\"Q\n\x0cTravelParams\x12\r\n\x05\x61void\x18\x01 \x01(\t\x12\x0c\n\x04mode\x18\x02 \x01(\t\x12\r\n\x05units\x18\x03 \x01(\t\x12\x15\n\rtraffic_model\x18\x04 \x01(\t\"P\n\x08Location\x12\x0b\n\x03_id\x18\x01 \x01(\t\x12\x0c\n\x04name\x18\x02 \x01(\t\x12\x0f\n\x07\x61\x64\x64ress\x18\x03 \x01(\t\x12\x0b\n\x03lat\x18\x04 \x01(\x02\x12\x0b\n\x03lon\x18\x05 \x01(\x02\"\xe7\x02\n\x08Traveler\x12\x0b\n\x03_id\x18\x01 \x01(\t\x12\x10\n\x08username\x18\x02 \x01(\t\x12\r\n\x05\x65mail\x18\x03 \x01(\t\x12%\n\x10location_ratings\x18\x04 \x01(\x0b\x32\x0b.tom.Vector\x12-\n\x18\x64\x65sired_time_in_location\x18\x05 \x01(\x0b\x32\x0b.tom.Vector\x12\x1d\n\x15road_travel_threshold\x18\x06 \x01(\x02\x12!\n\x19\x65\x61rliest_acceptable_start\x18\x07 \x01(\x02\x12\x1d\n\x15latest_acceptable_end\x18\x08 \x01(\x02\x12!\n\x19\x61llowed_start_flexibility\x18\t \x01(\x02\x12\x1f\n\x17\x61llowed_end_flexibility\x18\n \x01(\x02\x12\x19\n\x11\x61\x63tive_stay_start\x18\x0b \x01(\x02\x12\x17\n\x0f\x61\x63tive_stay_end\x18\x0c \x01(\x02\"\x1a\n\x06Vector\x12\x10\n\x08\x65lements\x18\x01 \x03(\x02\"\"\n\x05\x41rray\x12\x19\n\x04rows\x18\x01 \x03(\x0b\x32\x0b.tom.Vector2Q\n\x0eTripManagement\x12?\n\x10\x42uildTripMPSFile\x12\x13.tom.TripMPSRequest\x1a\x14.tom.TripMPSResponse\"\x00\x62\x06proto3')

_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, globals())
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'tom.common.common_pb2', globals())
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _TRIPMPSREQUEST._serialized_start=66
  _TRIPMPSREQUEST._serialized_end=399
  _TRIPMPSRESPONSE._serialized_start=401
  _TRIPMPSRESPONSE._serialized_end=438
  _TRAVELPARAMS._serialized_start=440
  _TRAVELPARAMS._serialized_end=521
  _LOCATION._serialized_start=523
  _LOCATION._serialized_end=603
  _TRAVELER._serialized_start=606
  _TRAVELER._serialized_end=965
  _VECTOR._serialized_start=967
  _VECTOR._serialized_end=993
  _ARRAY._serialized_start=995
  _ARRAY._serialized_end=1029
  _TRIPMANAGEMENT._serialized_start=1031
  _TRIPMANAGEMENT._serialized_end=1112
# @@protoc_insertion_point(module_scope)
