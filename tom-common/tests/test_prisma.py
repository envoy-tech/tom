import pytest
from tom.common import db


@pytest.mark.asyncio
async def test_connect(db_client):
    assert db_client.is_connected()


@pytest.mark.asyncio
async def test_get_profile(db_client):
    user = await db.get_profile(db_client, profile_id=1)
    assert user.name == "Guillermo Wilder-Gutierrez"


@pytest.mark.asyncio
async def test_get_profile_w_include(db_client):
    user = await db.get_profile(
        db_client,
        profile_id=1,
        include={"profile_trip": True}
    )
    assert user.profile_trip[0].trip_id == 1


@pytest.mark.asyncio
async def test_upload_itineraries(db_client, itineraries):
    trip = await db.update_trip(
        db_client,
        trip_id=1,
        field_name="itineraries_json_array",
        data=itineraries
    )
    assert trip.itineraries_json_array == itineraries
