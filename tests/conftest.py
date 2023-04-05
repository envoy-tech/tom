import os
import tempfile
import yaml

import pytest
import googlemaps
from dotenv import load_dotenv
from flask_app import create_app
from flask_app.db import get_db, init_db

with open(os.path.join(os.path.dirname(__file__), "data.sql"), "rb") as f:
    _data_sql = f.read().decode("utf8")

with open(os.path.join(os.path.dirname(__file__), "sample_trip.yaml"), "r") as f:
    _sample_trip = yaml.safe_load(f)


@pytest.fixture
def app():
    db_fd, db_path = tempfile.mkstemp()

    app = create_app({
        "TESTING": True,
        "DATABASE": db_path,
    })

    with app.app_context():
        init_db()
        get_db().executescript(_data_sql)

    yield app

    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()


class AuthActions(object):

    def __init__(self, client):
        self._client = client

    def login(self, username="test", password="test"):
        return self._client.post(
            "/auth/login",
            data={"username": username, "password": password}
        )

    def logout(self):
        return self._client.get("/auth/logout")


@pytest.fixture
def auth(client):
    return AuthActions(client)


@pytest.fixture
def env():
    return load_dotenv()


@pytest.fixture
def sample_trip():
    return _sample_trip


@pytest.fixture
def gmaps_client():
    return googlemaps.Client(key=os.getenv("GOOGLE_MAPS_API_KEY"))