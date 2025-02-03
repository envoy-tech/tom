import pytest
from tom.common import db


@pytest.mark.asyncio
async def test_connect(db_client):
    assert db_client.is_connected()


@pytest.mark.asyncio
async def test_get_profile():
    client = await db.connect()
    user = await db.get_profile(client, profile_id=1)
    assert user.name == "Guillermo Wilder-Gutierrez"
    await client.disconnect()


@pytest.mark.asyncio
async def test_get_profile_w_include():
    client = await db.connect()
    user = await db.get_profile(
        client,
        profile_id=1,
        include={"profile_trip": True}
    )
    assert user.profile_trip[0].trip_id == 1
    await client.disconnect()


@pytest.mark.asyncio
async def test_upload_itineraries(itineraries):
    client = await db.connect()
    trip = await db.update_trip(
        client,
        trip_id=1,
        field_name="itineraries_json_array",
        data=itineraries
    )
    assert trip.itineraries_json_array == itineraries
    await client.disconnect()
