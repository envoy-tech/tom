from typing import List
import numpy as np
from trip import Trip
from location import Location


class LocationTripParams:

    def __init__(self, trip: Trip):
        self.__trip: Trip = trip
        self.__locations: List[Location] = []
        self.__distances: np.ndarray or None = None
        self.__id: int = self.trip_id

    @property
    def trip(self) -> Trip:
        return self.__trip

    @property
    def trip_id(self):
        return self.trip.id

    def add_location(self, loc: Location):
        if not isinstance(loc, Location):
            raise TypeError(f"Can only append Location class to locations list, not {type(loc)}")
        self.__locations.append(loc)

    def compute_distance_between(self, x: Location, y: Location):
        return
