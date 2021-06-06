
class Location(object):

    def __init__(self, name: str, lat: float, lon: float):
        self.__name: str = name
        self.__lat: float = lat
        self.__lon: float = lon

    def __hash__(self):
        return hash((self.name, self.lat, self.lon))

    def __repr__(self):
        return f"{self.name}|{self.lat}|{self.lon}"

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
            raise AttributeError(f"Location latitude cannot be nan")
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


class MajorLocation(Location):

    def __init__(self, name, lat, lon, otherstuff):
        super().__init__(name, lat, lon)
        self.things: object = otherstuff

    def do_thing(self) -> object:
        return self.things

    @classmethod
    def empty_loc(cls):
        return cls("Anywhere", 0.0, 0.0, None)
