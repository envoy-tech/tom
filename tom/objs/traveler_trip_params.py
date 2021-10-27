from typing import List, Dict, Tuple
from traveler import Traveler
from trip import Trip
from location import Location


class TravelerTripParameters:

    def __init__(self, trip: Trip, traveler: Traveler):
        self.__trip: Trip = trip
        self.__traveler: Traveler = traveler
        self.__location_ratings: Dict[int: float or None] = {location.id: None for location in self.locations}
        self.__desired_location_stays: Dict[int: float or None] = {location.id: None for location in self.locations}
        self.__time_btw_locations_threshold: float or None = None
        self.__id: int = self.__hash__()

    def __hash__(self) -> int:
        return hash((self.trip_id, self.traveler_id))

    def __eq__(self, other) -> bool:
        try:
            return isinstance(other, type(self)) and other.id == self.id
        except AttributeError:
            return False

    @property
    def id(self) -> int:
        return self.id

    @property
    def trip(self) -> Trip:
        return self.__trip

    @property
    def locations(self) -> List[Location]:
        return self.trip.locations

    @property
    def traveler(self) -> Traveler:
        return self.__traveler

    @property
    def trip_id(self) -> int:
        return self.trip.id

    @property
    def traveler_id(self) -> int:
        return self.traveler.id

    @property
    def location_ratings(self) -> dict:
        return self.__location_ratings

    @location_ratings.setter
    def location_ratings(self, val: Tuple[int, float]):
        if type(val) != tuple:
            raise TypeError(f"Location ratings setter requires argument type tuple, not {type(val)}")
        key, value = val
        if key not in self.__location_ratings.keys():
            raise KeyError(f"Location key {key} does not exist in location ratings dict")
        self.__location_ratings[key] = value

    @location_ratings.deleter
    def location_ratings(self):
        raise Warning("Cannot delete location ratings dict, change specific values instead")

    @property
    def desired_location_stays(self) -> dict:
        return self.__desired_location_stays

    @desired_location_stays.setter
    def desired_location_stays(self, val: Tuple[int, float]):
        if type(val) != tuple:
            raise TypeError(f"Desired location stays setter requires argument type tuple, not {type(val)}")
        key, value = val
        if key not in self.__desired_location_stays.keys():
            raise KeyError(f"Location key {key} does not exist in desired location stays dict")
        self.__desired_location_stays[key] = value

    @desired_location_stays.deleter
    def desired_location_stays(self):
        raise Warning("Cannot delete desired location stays dict, change specific values instead")

    @property
    def time_btw_locations_threshold(self):
        return self.__time_btw_locations_threshold

    @time_btw_locations_threshold.setter
    def time_btw_locations_threshold(self, val):
        if type(val) not in (float, type(None)):
            raise TypeError(f"Time between locations threshold argument must be float or NoneType, not {type(val)}")
        self.__time_btw_locations_threshold = val

    @time_btw_locations_threshold.deleter
    def time_btw_locations_threshold(self):
        self.__time_btw_locations_threshold = None
