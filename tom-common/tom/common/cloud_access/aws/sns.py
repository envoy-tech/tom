import logging
from enum import Enum, auto

import boto3

from tom.common import Env

logger = logging.getLogger(__name__)


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
    sns_arn = f"{Env.AWS_SNS_ARN}:{topic_name}"
    response = sns_client.publish(
        TopicArn=sns_arn,
        Message=message
    )
    logger.info("Response from SNS:", extra={"arn": sns_arn, **response})
    return
