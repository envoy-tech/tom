from typing import List
from location import Location
from traveler import Traveler, LeadTraveler
import datetime as dt


class Trip:

    def __init__(self, name: str, lead_traveler: LeadTraveler):
        self.__name: str = name
        self.__lead_traveler: LeadTraveler = lead_traveler
        self.__travelers: List[Traveler] = [lead_traveler]
        self.__locations: List[Location] = []
        self.__start_location: Location or None = None
        self.__end_location: Location or None = None
        self.__start_date: dt.datetime or None = None
        self.__end_date: dt.datetime or None = None
        self.__id: int = self.__hash__()

    def __hash__(self) -> int:
        return hash((self.name, self.lead_traveler.name))

    def __eq__(self, other) -> bool:
        try:
            return isinstance(other, type(self)) and other.id == self.id
        except AttributeError:
            return False

    def __repr__(self) -> str:
        return f"Trip(Name: {self.name}, " \
               f"Start: {self.starting_location}, " \
               f"End: {self.ending_location}, " \
               f"Lead Traveler: {self.lead_traveler})"

    @property
    def id(self) -> int:
        return self.__id

    @property
    def name(self) -> str:
        return self.__name

    @property
    def lead_traveler(self) -> LeadTraveler:
        return self.__lead_traveler

    @property
    def starting_location(self) -> Location:
        return self.__start_location

    @property
    def ending_location(self) -> Location:
        return self.__end_location

    @property
    def locations(self) -> List[Location]:
        return self.__locations

    @property
    def duration_datetime(self) -> dt.timedelta:
        return self.__end_date - self.__start_date

    @property
    def duration_days(self) -> float:
        return self.duration_datetime.days

    @property
    def duration_hours(self) -> float:
        return self.duration_datetime.total_seconds() / 60**2

    @property
    def travelers(self) -> List[Traveler]:
        return self.__travelers

    @property
    def num_locations(self) -> int:
        return len(self.locations)

    @property
    def num_travelers(self) -> int:
        return len(self.travelers)

    def add_traveler(self, traveler: Traveler):
        if not isinstance(traveler, Traveler):
            raise TypeError(f"Cannot append object class {type(traveler)} to traveler list, must be Traveler.")
        self.__travelers.append(traveler)

    def rm_traveler(self, traveler: Traveler):
        self.__travelers.remove(traveler)

    def add_start_location(self, loc: Location):
        self.__start_location = loc

    def add_end_location(self, loc: Location):
        self.__end_location = loc

    def add_location(self, loc: Location):
        self.__locations.append(loc)

    def rm_location(self, loc: Location):
        self.__locations.remove(loc)
