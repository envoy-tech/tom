from typing import List


class Traveler(object):

    def __init__(self, name: str):
        self.__name: str = name
        self.__major_loc_ratings: List[float] = []
        self.__major_loc_times: List[float]

    def __repr__(self) -> str:
        return self.name

    @property
    def name(self) -> str:
        return self.__name

    @property
    def major_loc_ratings(self) -> List[float]:
        return self.__major_loc_ratings

    @property
    def major_loc_times(self) -> List[float]:
        return self.__major_loc_times


class LeadTraveler(Traveler):

    def __init__(self, name: str, v_import_things: int):
        super().__init__(name)
        self.__v_import: int = v_import_things
