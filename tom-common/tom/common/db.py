import os
from typing import Optional
from typing import Union

from prisma import Prisma
from prisma import Json

from prisma.models import (
    profile as Profile,
    profile_trip as ProfileTrip,
    trip as Trip
)


async def connect(*, database_url: str = None) -> Prisma:

    if database_url is None:
        database_url: str = os.getenv("DATABASE_URL")

    db = Prisma(
        auto_register=True,
        datasource={"url": database_url}
    )
    await db.connect()
    return db


async def create_profile(
        db: Prisma,
        *,
        data
) -> Profile:
    profile = await db.profile.create(
        data=data
    )
    return profile


async def get_profile(
        db: Prisma,
        *,
        profile_id: int,
        include: Optional[dict[str, bool]] = None
) -> Profile:
    kwargs = {}
    if include:
        kwargs["include"] = include

    profile = await db.profile.find_unique(
        where={"id": profile_id},
        **kwargs
    )
    return profile


async def create_trip(
        db: Prisma,
        *,
        data
) -> Trip:
    trip = await db.trip.create(
        data=data
    )
    return trip


async def get_trip(
        db: Prisma,
        *,
        trip_id: int,
        include: Optional[dict[str, bool]] = None
) -> Trip:
    kwargs = {}
    if include:
        kwargs["include"] = include

    trip = await db.trip.find_unique(
        where={"id": trip_id},
        **kwargs
    )
    return trip


async def update_trip(
        db: Prisma,
        *,
        trip_id: int,
        field_name: str,
        data: dict[str, Union[int, str]]
) -> Trip:
    trip = await db.trip.update(
        where={"id": trip_id},
        data={field_name: [Json(d) for d in data]}
    )
    return trip


async def create_profile_trip(
        db: Prisma,
        *,
        data
) -> ProfileTrip:
    profile_trip = await db.profile_trip.create(
        data=data
    )
    return profile_trip


async def get_profile_trip(
        db: Prisma,
        *,
        profile_id: int,
        trip_id: int,
        include: Optional[dict[str, bool]] = None
) -> ProfileTrip:
    kwargs = {}
    if include:
        kwargs["include"] = include

    profile_trip = await db.profile_trip.find_unique(
        where={
            "profile_id_trip_id" : {
                "profile_id": profile_id,
                "trip_id": trip_id
            }
        },
        **kwargs
    )
    return profile_trip
