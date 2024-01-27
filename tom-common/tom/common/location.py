from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Location:

    lat: float
    lon: float

    @property
    def lat_lon(self) -> tuple[float, float]:
        return self.lat, self.lon

    def encode(self):
        return self.__dict__
