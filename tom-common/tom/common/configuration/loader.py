import configparser
from pathlib import Path


def parse_config(config_path: Path) -> configparser.ConfigParser:

    config = configparser.ConfigParser()
    config.read_file(open(config_path))
    return config
