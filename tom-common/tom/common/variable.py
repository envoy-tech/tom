from abc import ABC, abstractmethod

from tom.common.registry import Registry


class Variable(ABC):

    def __init__(self, num_travelers: int, num_locations: int):
        self.num_travelers = num_travelers
        self.num_locations = num_locations

    @property
    @abstractmethod
    def shape(self) -> tuple[int, ...]:
        pass


VARIABLE_REGISTRY = Registry(Variable)


@VARIABLE_REGISTRY.register("GO")
class GO(Variable):

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("FROM")
class FROM(Variable):

    @property
    def shape(self) -> tuple[int, ...]:
        return self.num_locations, self.num_locations


@VARIABLE_REGISTRY.register("STAY")
class STAY(Variable):

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("TIME")
class TIME(Variable):

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("INTER_DEPART_DAY")
class INTER_DEPART_DAY(Variable):

    @property
    def shape(self) -> tuple[int, ...]:
        return self.num_locations, self.num_locations


@VARIABLE_REGISTRY.register("INTER_DEPART_HOUR")
class INTER_DEPART_HOUR(Variable):

    @property
    def shape(self) -> tuple[int, ...]:
        return self.num_locations, self.num_locations


@VARIABLE_REGISTRY.register("DEPART_DAY")
class DEPART_DAY(Variable):

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("DEPART_HOUR")
class DEPART_HOUR(Variable):

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("ARRIVE_DAY")
class ARRIVE_DAY(Variable):

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("ARRIVE_HOUR")
class ARRIVE_HOUR(Variable):

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("R_DEV")
class R_DEV(Variable):

    @property
    def shape(self) -> int:
        return self.num_travelers


@VARIABLE_REGISTRY.register("S_DEV")
class S_DEV(Variable):

    @property
    def shape(self) -> tuple[int, ...]:
        return self.num_travelers, self.num_locations


@VARIABLE_REGISTRY.register("I_DEV")
class I_DEV(Variable):

    @property
    def shape(self) -> tuple[int, ...]:
        return self.num_travelers, self.num_locations, self.num_locations


@VARIABLE_REGISTRY.register("MEAN_R")
class MEAN_R(Variable):

    @property
    def shape(self) -> int:
        return self.num_travelers


@VARIABLE_REGISTRY.register("INTER_R")
class INTER_R(Variable):

    @property
    def shape(self) -> tuple[int, ...]:
        return self.num_travelers, self.num_locations


@VARIABLE_REGISTRY.register("SUM_R")
class SUM_R(Variable):

    @property
    def shape(self) -> int:
        return self.num_travelers
