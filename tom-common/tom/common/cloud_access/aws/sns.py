import os
from enum import Enum, auto

import boto3
from dotenv import load_dotenv

from tom.common import Env

# Environment variables are set by AWS Lambda function in prod
# or local .env file for development
_ = load_dotenv()
AWS_SNS_ARN = os.getenv(Env.AWS_SNS_ARN)


class TopicNames:
    optimization_status = "optimization-status"


class TripStatus(Enum):
    """Trip status."""
    TRIP_MANAGER_BEGIN = auto()
    TRIP_MANAGER_SUCCESS = auto()
    TRIP_MANAGER_FAILURE = auto()
    OPTIMIZATION_ENGINE_BEGIN = auto()
    OPTIMIZATION_ENGINE_SUCCESS = auto()
    OPTIMIZATION_ENGINE_FAILURE = auto()
    CANCELLED = auto()


def get_sns_client():
    return boto3.client("sns")


def publish_to_sns(
        sns_client,
        topic_name: str,
        message: str
):
    """ Publish message to SNS topic

    :param sns_client: the SNS client
    :param topic_name: the SNS topic name
    :param message: the message to publish
    """
    sns_arn = f"{AWS_SNS_ARN}:{topic_name}"
    return sns_client.publish(
        TopicArn=sns_arn,
        Message=message
    )
