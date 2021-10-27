class Traveler:

    def __init__(self, name: str, email: str):
        self.__name: str = name
        self.__email: str = email
        self.__id: int = self.__hash__()

    def __hash__(self) -> int:
        return hash((self.name, self.email))

    def __eq__(self, other) -> bool:
        try:
            return isinstance(other, type(self)) and other.id == self.id
        except AttributeError:
            return False

    def __repr__(self) -> str:
        return f"Traveler(Name: {self.name}, " \
               f"Email: {self.email})"

    @property
    def id(self) -> int:
        return self.__id

    @property
    def name(self) -> str:
        return self.__name

    @name.setter
    def name(self, var):
        if type(var) != str:
            raise TypeError(f"Traveler name must be str, not {type(var)}")
        self.__name = var

    @property
    def email(self) -> str:
        return self.__email

    @email.setter
    def email(self, var):
        if type(var) != str:
            raise TypeError(f"Traveler email must be str, not {type(var)}")
        self.__email = var


class LeadTraveler(Traveler):

    def __init__(self, name: str, email: str, v_import_things: int):
        super().__init__(name, email)
        self.__v_import: int = v_import_things
