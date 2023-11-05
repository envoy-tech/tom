from typing import Optional

import boto3


S3_Resource = type(boto3.resource("s3"))
S3_Object = type(boto3.resource("s3").Object)


def connect_to_s3(
        region: str
) -> S3_Resource:
    """ Generic access to S3 bucket

    :param region: Region S3 resources are located
    :return: S3 resource session instance
    """
    s3 = boto3.resource("s3", region_name=region)
    return s3


def upload_to_s3(
        s3,
        bucket_name: str,
        object_string: str,
        object_key: str,
        *,
        object_metadata: Optional[dict] = None
) -> S3_Object:
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


def delete_file_in_s3(
        s3,
        filename: str,
        bucket_name: str
):
    s3.Object(bucket_name, filename).delete()


def parse_s3_event(event: dict) -> tuple[str, str]:
    """ Parse S3 event for bucket and object key

    :param event: S3 event
    :return: bucket name and object key
    """
    bucket_name = event["Records"][0]["s3"]["bucket"]["name"]
    object_key = event["Records"][0]["s3"]["object"]["key"]
    return bucket_name, object_key
