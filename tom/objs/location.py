from typing import Tuple


class Location:

    def __init__(self, name: str, lat: float, lon: float):
        self.__name: str = name
        self.__lat: float = lat
        self.__lon: float = lon
        self.__id: int = self.__hash__()

    def __hash__(self) -> int:
        return hash((self.name, self.lat, self.lon))

    def __eq__(self, other) -> bool:
        try:
            return isinstance(other, type(self)) and other.id == self.id
        except AttributeError:
            return False

    def __repr__(self) -> str:
        return f"{self.name}|{self.lat}|{self.lon}"

    @property
    def id(self) -> int:
        return self.__id

    @property
    def name(self) -> str:
        return self.__name

    @name.setter
    def name(self, var):
        if type(var) != str:
            raise TypeError(f"Location name must be str, not {type(var)}")
        else:
            self.__name = var

    @property
    def lat(self) -> float:
        return self.__lat

    @lat.setter
    def lat(self, var):
        if type(var) != float:
            raise TypeError(f"Location latitude must be float, not {type(var)}")
        elif str(var) == 'nan':
            raise ValueError(f"Location latitude cannot be nan")
        else:
            self.__lat = var

    @property
    def lon(self) -> float:
        return self.__lon

    @lon.setter
    def lon(self, var):
        if type(var) != float:
            raise TypeError(f"Location longitude must be float, not {type(var)}")
        elif str(var) == 'nan':
            raise ValueError(f"Location longitude cannot be nan")
        else:
            self.__lon = var

    @property
    def coords(self) -> Tuple:
        return self.lat, self.lon
