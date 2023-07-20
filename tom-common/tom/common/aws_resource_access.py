import os
import uuid
from pathlib import Path

import boto3
import botocore

from tom.common import Env


class ServiceNames:
    S3 = "s3"
    STS = "sts"


def assume_role(account: str, role: str):
    _session = boto3.Session(
        aws_access_key_id=os.getenv(Env.S3_ACCESS_KEY_ID),
        aws_secret_access_key=os.getenv(Env.S3_PRIVATE_KEY)
    )
    sts_client = _session.client(ServiceNames.STS)
    assumed_role = sts_client.assume_role(
        RoleArn="arn:aws:iam::{}:role/{}".format(account, role),
        RoleSessionName=str(uuid.uuid4())
    )
    return assumed_role


def connect_to_s3(
        region: str,
        assumed_role
):
    """ Generic access to S3 bucket

    :param region: Region S3 resources are located
    :param assumed_role: AWS assumed role
    :return: S3 resource session instance
    """
    _creds = assumed_role["Credentials"]
    s3 = boto3.resource(
        service_name=ServiceNames.S3,
        region_name=region,
        aws_access_key_id=_creds["AccessKeyId"],
        aws_secret_access_key=_creds["SecretAccessKey"],
        aws_session_token=_creds["SessionToken"]
    )
    return s3


def upload_to_s3(
        s3,
        filepath: Path,
        bucket_name: str
):
    """ Save file to generic S3 bucket. File name in S3 bucket will mirror name
        of local file.

    :param s3: the S3 resource connection
    :param filepath: path to local file
    :param bucket_name: S3 bucket name
    """
    _filename = os.path.basename(filepath)
    s3.Bucket(bucket_name).upload_file(Filename=filepath, Key=_filename)


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
