import json
from urllib import parse
import argparse

import boto3
from botocore.exceptions import ClientError


parser = argparse.ArgumentParser(
    prog="DevEnvUpdate",
    description="Development environment file update script."
)

parser.add_argument("env_file")
parser.add_argument("tf_json")

if __name__ == "__main__":

    args = parser.parse_args()
    tf_output = json.loads(args.tf_json)

    rds_endpoint = tf_output["RDS_URL"]["value"]
    rds_username = tf_output["RDS_USERNAME"]["value"]
    rds_user_secret_dict: dict = tf_output["RDS_USER_SECRET_ID"]["value"][0]
    rds_user_secret_arn = rds_user_secret_dict["secret_arn"].split(":")[-1]
    rds_user_secret_name = rds_user_secret_arn.rsplit("-", 1)[0]

    session = boto3.session.Session()
    client = session.client(
        service_name="secretsmanager",
        region_name="us-east-1"
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=rds_user_secret_name
        )
    except ClientError as e:
        raise e

    rds_secret_dict = json.loads(get_secret_value_response["SecretString"])
    rds_password = rds_secret_dict["password"]
    rds_password_encoded = parse.quote(rds_password)
    database_url = f"postgresql://{rds_username}:{rds_password_encoded}@{rds_endpoint}"

    with open(args.env_file, "a") as env:
        for key, val_dict in tf_output.items():
            if key.startswith("RDS"):
                continue
            val = val_dict["value"]
            env.write(f"{key}={val}\n")

        env.write(f'DATABASE_URL={database_url}:5432/adventurus\n')
