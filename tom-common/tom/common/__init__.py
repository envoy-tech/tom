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
    PROJECT_ROOT = "PROJECT_ROOT"
    GMAPS_API_KEY = "GOOGLE_MAPS_API_KEY"
    AWS_ACCESS_KEY_ID = "AWS_ACCESS_KEY_ID"
    AWS_SECRET_ACCESS_KEY = "AWS_SECRET_ACCESS_KEY"
    AWS_SESSION_TOKEN = "AWS_SESSION_TOKEN"
    AWS_SNS_ARN = "AWS_SNS_ARN"


class S3Params:
    REGION = "us-east-1"
    BUCKET_NAME = "adventurus-mps-dev"
