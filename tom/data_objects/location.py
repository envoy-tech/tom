from __future__ import annotations
from dataclasses import dataclass
from typing import Optional


@dataclass
class Location:

    _id: str
    name: str
    address: Optional[str]
    lat: float
    lon: float


    @property
    def id(self) -> str:
        return self._id


    @property
    def lat_lon(self) -> tuple[float, float]:
        return self.lat, self.lon
