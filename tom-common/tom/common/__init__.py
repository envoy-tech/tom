import os

from tom.common.location import Location
from tom.common.traveler import Traveler
from tom.common.variable import (
    GO,
    FROM,
    STAY,
    TIME,
    INTER_DEPART_DAY,
    INTER_DEPART_HOUR,
    ARRIVE_DAY,
    ARRIVE_HOUR,
    DEPART_DAY,
    DEPART_HOUR,
    R_DEV,
    S_DEV,
    I_DEV,
    MEAN_R,
    INTER_R,
    SUM_R,
    VARIABLE_REGISTRY,
)


class Env:
    GMAPS_API_KEY  = os.getenv("GMAPS_API_KEY")
    AWS_SNS_ARN    = os.getenv("AWS_SNS_ARN")
    SNS_TOPIC_NAME = os.getenv("SNS_TOPIC_NAME")
    MPS_S3_BUCKET  = os.getenv("MPS_S3_BUCKET")


class S3Params:
    REGION = "us-east-1"
