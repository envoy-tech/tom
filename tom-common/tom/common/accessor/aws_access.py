import os
from typing import Optional

import boto3
import botocore
from dotenv import load_dotenv

from tom.common import Env

# Environment variables are set by AWS Lambda function in prod
# or local .env file for development
_ = load_dotenv()
AWS_ACCESS_KEY_ID = os.getenv(Env.AWS_ACCESS_KEY_ID)
AWS_SECRET_ACCESS_KEY = os.getenv(Env.AWS_SECRET_ACCESS_KEY)
AWS_SESSION_TOKEN = os.getenv(Env.AWS_SESSION_TOKEN)


class ServiceNames:
    S3 = "s3"
    STS = "sts"


def connect_to_s3(
        region: str
):
    """ Generic access to S3 bucket

    :param region: Region S3 resources are located
    :return: S3 resource session instance
    """
    s3 = boto3.resource(
        service_name=ServiceNames.S3,
        region_name=region,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        aws_session_token=AWS_SESSION_TOKEN
    )
    return s3


def upload_to_s3(
        s3,
        bucket_name: str,
        object_string: str,
        object_key: str,
        *,
        object_metadata: Optional[dict] = None
):
    """ Save file to generic S3 bucket. File name in S3 bucket will mirror name
        of local file.

    :param s3: the S3 resource connection
    :param object_string: object string to upload
    :param object_key: S3 object key
    :param bucket_name: S3 bucket name
    :param object_metadata: optional metadata to add to object
    """
    _object_bytes = bytes(object_string, "utf-8")
    return s3.Bucket(bucket_name).put_object(Body=_object_bytes, Key=object_key, Metadata=object_metadata)


def verify_file_in_s3(
        s3,
        filename: str,
        bucket_name: str,
):
    try:
        s3.Object(bucket_name, filename).load()
        return True
    except botocore.exceptions.ClientError:
        return False


def delete_file_in_s3(
        s3,
        filename: str,
        bucket_name: str
):
    s3.Object(bucket_name, filename).delete()
