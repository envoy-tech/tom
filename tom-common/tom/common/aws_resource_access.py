import os
from pathlib import Path

import boto3


class ServiceNames:
    S3 = "s3"


def connect_to_s3(
        region: str,
        aws_access_key_id: str,
        aws_secret_access_key: str
):
    """ Generic access to S3 bucket

    :param region: Region S3 resources are located
    :param aws_access_key_id: User access key ID
    :param aws_secret_access_key: User secret access key
    :return: S3 resource session instance
    """
    s3 = boto3.resource(
        service_name=ServiceNames.S3,
        region_name=region,
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key
    )
    return s3


def upload_to_s3(
        filepath: Path,
        bucket_name: str,
        region: str,
        aws_access_key_id: str,
        aws_secret_access_key: str
):
    """ Save file to generic S3 bucket. File name in S3 bucket will mirror name
        of local file.

    :param filepath: path to local file
    :param bucket_name: S3 bucket name
    :param region: S3 bucket region
    :param aws_access_key_id: User access key ID
    :param aws_secret_access_key: User secret access key
    """
    _filename = os.path.basename(filepath)
    s3 = connect_to_s3(region, aws_access_key_id, aws_secret_access_key)
    s3.Bucket(bucket_name).upload_file(Filename=filepath, Key=_filename)
