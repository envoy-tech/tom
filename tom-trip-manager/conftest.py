import os
import yaml
import random
from concurrent import futures
from pathlib import Path
from functools import cache


import configparser
import pytest
import grpc
import googlemaps
from dotenv import load_dotenv

from tom.common.configuration.loader import parse_config
from tom.common.common_pb2_grpc import add_TripManagementServicer_to_server
from tom.trip_manager.servicer import TripMgmtServicer


def _get_absolute_path(relative_path: str) -> Path:
    return(Path(__file__).parent / relative_path).resolve()


@cache
def _read_binary_file(file_path: Path) -> bytes:
    with open(file_path, "rb") as f:
        return f.read()


@pytest.fixture(scope="package")
def env():
    return load_dotenv()


@pytest.fixture(scope="package")
def mps_folder() -> Path:
    return (Path(__file__) / "../../mps_files").resolve()


@pytest.fixture(scope="package")
def sample_trip() -> dict:
    with open(_get_absolute_path("tests/sample_trip.yaml"), "r") as f:
        _sample_trip = yaml.safe_load(f)
    return _sample_trip


@pytest.fixture(scope="package")
def sample_trip_params() -> dict:
    _params = {
        "avoid": "tolls",
        "mode": "driving",
        "units": "imperial",
        "traffic_model": "best_guess"
    }
    return _params


@pytest.fixture(scope="package")
def gmaps_client():
    return googlemaps.Client(key=os.getenv("GOOGLE_MAPS_API_KEY"))


@pytest.fixture(scope="package")
def trip_manager_hostname() -> str:
    return "localhost"


@pytest.fixture(scope="package")
def trip_manager_port_number() -> int:
    return random.randint(2**9, 2**15 - 1) * 2


@pytest.fixture(scope="package")
def trip_manager_config_path() -> Path:
    return _get_absolute_path("../configs/trip-manager/test-config.cfg")


@pytest.fixture(scope="package")
def trip_manager_default_config(trip_manager_config_path) -> configparser.ConfigParser:
    return parse_config(trip_manager_config_path)


@pytest.fixture(scope="package")
def secure_trip_manager(trip_manager_default_config, trip_manager_config_path) -> tuple[grpc.Server, str, int]:

    hostname = trip_manager_default_config.get("CONNECTION", "host")
    port = trip_manager_default_config.get("CONNECTION", "port")

    cert_path = Path(
        trip_manager_default_config / trip_manager_default_config.get("TLS", "certificate")
    ).resolve()
    private_key_path = Path(
        trip_manager_config_path / trip_manager_default_config.get("TLS", "private_key")
    ).resolve()
    trust_store_path = Path(
        trip_manager_config_path / trip_manager_default_config.get("TLS", "trust_store")
    ).resolve()

    certificate = _read_binary_file(cert_path)
    private_key = _read_binary_file(private_key_path)
    trust_store = _read_binary_file(trust_store_path)

    credentials = grpc.ssl_server_credentials([(private_key, certificate)], trust_store, True)

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=8))
    server.add_secure_port(f"{hostname}:{port}", credentials)
    add_TripManagementServicer_to_server(
        TripMgmtServicer(trip_manager_default_config), server
    )
    server.start()
    yield server, hostname, port
    server.stop(None)
