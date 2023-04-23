from tom.common.location import Location
from tom.common.traveler import Traveler


class Env:
    GMAPS_API_KEY = "GOOGLE_MAPS_API_KEY"
    S3_ACCESS_KEY_ID = "S3_ACCESS_KEY_ID"
    S3_PRIVATE_KEY = "S3_PRIVATE_KEY"


class S3Params:
    REGION = "us-east-1"
    BUCKET_NAME = "allin-mps-files"
