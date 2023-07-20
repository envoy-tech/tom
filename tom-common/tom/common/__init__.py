from tom.common.location import Location
from tom.common.traveler import Traveler


class Env:
    GMAPS_API_KEY = "GOOGLE_MAPS_API_KEY"
    S3_ACCESS_KEY_ID = "S3_ACCESS_KEY_ID"
    S3_PRIVATE_KEY = "S3_PRIVATE_KEY"
    S3_ACCESS_ARN = "S3_ACCESS_ARN"
    S3_ACCESS_ROLE = "S3_ACCESS_ROLE"


class S3Params:
    REGION = "us-east-1"
    BUCKET_NAME = "allin-mps-files"


class VarName:
    GO = "GO"
    FROM = "FROM"
    STAY = "STAY"
    TIME = "TIME"
    INTER_DEPART_DAY = "INTER_DEPART_DAY"
    INTER_DEPART_HOUR = "INTER_DEPART_HOUR"
    DEPART_DAY = "DEPART_DAY"
    DEPART_HOUR = "DEPART_HOUR"
    ARRIVE_DAY = "ARRIVE_DAY"
    ARRIVE_HOUR = "ARRIVE_HOUR"
    R_DEV = "R_DEV"
    S_DEV = "S_DEV"
    I_DEV = "I_DEV"
    MEAN_R = "MEAN_R"
    INTER_R = "INTER_R"
    SUM_R = "SUM_R"

