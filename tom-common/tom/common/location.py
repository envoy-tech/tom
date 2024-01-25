from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Location:

    _id: str
    name: str
    address: str
    lat: float
    lon: float

    @property
    def id(self) -> str:
        return self._id

    @property
    def lat_lon(self) -> tuple[float, float]:
        return self.lat, self.lon

    def encode(self):
        return self.__dict__
