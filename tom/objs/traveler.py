from typing import List


class Traveler(object):

    def __init__(self, name: str, email: str):
        self.__name: str = name
        self.__email: str = email
        self.__major_loc_ratings: List[float] = []
        self.__major_loc_times: List[float] = []

    def __hash__(self):
        return hash((self.name, self.email))

    def __repr__(self):
        return self.name

    @property
    def name(self) -> str:
        return self.__name

    @name.setter
    def name(self, var):
        if type(var) != str:
            raise TypeError(f"Traveler name must be str, not {type(var)}")
        else:
            self.__name = var

    @property
    def email(self) -> str:
        return self.__email

    @email.setter
    def email(self, var):
        if type(var) != str:
            raise TypeError(f"Traveler email must be str, not {type(var)}")
        else:
            self.__email = var

    @property
    def major_loc_ratings(self) -> List[float]:
        return self.__major_loc_ratings

    @property
    def major_loc_times(self) -> List[float]:
        return self.__major_loc_times


class LeadTraveler(Traveler):

    def __init__(self, name: str, email: str, v_import_things: int):
        super().__init__(name, email)
        self.__v_import: int = v_import_things
