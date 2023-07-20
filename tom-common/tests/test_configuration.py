from pathlib import Path

from tom.common.configuration import loader


def test_parse_config():
    config_path = Path("../../configs/trip-manager/tests-config.cfg")
    config = loader.parse_config(config_path)
    assert config
