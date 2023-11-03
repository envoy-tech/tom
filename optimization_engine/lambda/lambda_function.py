import json

from tom.common import S3Params, VARIABLE_REGISTRY
from tom.common.cloud_access.aws import s3, sns
from optimization_engine import *


class VarName:
    pass


def handler(event, context):

    bucket_name, object_key = s3.parse_s3_event(event)

    # Get the uploaded object from S3
    s3_client = s3.connect_to_s3(S3Params.REGION)
    obj_response = s3_client.get_object(
        Bucket=bucket_name,
        Key=object_key
    )

    obj_body = obj_response["Body"].read().decode("utf-8")
    obj_metadata = json.loads(obj_response["Metadata"])

    # Optimize MPS file data
    solver = OptimizeMPSData(obj_body)

    num_locations = obj_metadata["num_locations"]
    num_travelers = obj_metadata["num_travelers"]

    start_location_id = obj_metadata["start_location_id"]
    end_location_id = obj_metadata["end_location_id"]

    var_idxs = obj_metadata["var_idxs"]

    VARS = {}
    for var_name in VARIABLE_REGISTRY:
        setattr(VarName, var_name, var_name)
        var = VARIABLE_REGISTRY[var_name](num_travelers, num_locations)
        begin_idx, end_idx = var_idxs[var_name]
        var.data = [mpvar.solution_value() for mpvar in solver.variables()[begin_idx:end_idx+1]]
        VARS[var_name] = var

    



    return
