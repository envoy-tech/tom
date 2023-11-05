from abc import ABC, abstractmethod

import numpy as np

from tom.common.registry import Registry


class Variable(ABC):

    def __init__(self, num_travelers: int, num_locations: int):
        self.num_travelers = num_travelers
        self.num_locations = num_locations
        self.data = None

    @property
    @abstractmethod
    def first_var_name(self):
        pass

    @property
    @abstractmethod
    def shape(self) -> tuple[int, ...]:
        pass

    @property
    def values(self) -> np.ndarray:
        return np.array(self.data).reshape(self.shape)

    def end_idx(self, start_idx: int):
        return start_idx + np.prod(self.shape)


VARIABLE_REGISTRY = Registry(Variable)


@VARIABLE_REGISTRY.register("GO")
class GO(Variable):

    @property
    def first_var_name(self):
        return "GO_[(0,)]"

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("FROM")
class FROM(Variable):

    @property
    def first_var_name(self):
        return "FROM_[(0,_0)]"

    @property
    def shape(self) -> tuple[int, ...]:
        return self.num_locations, self.num_locations

    def to_route(self, start_idx: int) -> list[int]:
        res = np.array(self.data).reshape(self.shape)
        transits = dict(zip(*res.nonzero()))
        route = [start_idx]
        next_idx = transits.get(start_idx)
        while (next_idx is not None) and (next_idx != start_idx):
            route.append(next_idx)
            next_idx = transits.get(next_idx)
        return route


@VARIABLE_REGISTRY.register("STAY")
class STAY(Variable):

    @property
    def first_var_name(self):
        return "STAY_[(0,)]"

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("TIME")
class TIME(Variable):

    @property
    def first_var_name(self):
        return "TIME_[(0,)]"

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("INTER_DEPART_DAY")
class INTER_DEPART_DAY(Variable):

    @property
    def first_var_name(self):
        return "INTER_DEPART_DAY_[(0,_0)]"

    @property
    def shape(self) -> tuple[int, ...]:
        return self.num_locations, self.num_locations


@VARIABLE_REGISTRY.register("INTER_DEPART_HOUR")
class INTER_DEPART_HOUR(Variable):

    @property
    def first_var_name(self):
        return "INTER_DEPART_HOUR_[(0,_0)]"

    @property
    def shape(self) -> tuple[int, ...]:
        return self.num_locations, self.num_locations


@VARIABLE_REGISTRY.register("DEPART_DAY")
class DEPART_DAY(Variable):

    @property
    def first_var_name(self):
        return "DEPART_DAY_[(0,)]"

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("DEPART_HOUR")
class DEPART_HOUR(Variable):

    @property
    def first_var_name(self):
        return "DEPART_HOUR_[(0,)]"

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("ARRIVE_DAY")
class ARRIVE_DAY(Variable):

    @property
    def first_var_name(self):
        return "ARRIVE_DAY_[(0,)]"

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("ARRIVE_HOUR")
class ARRIVE_HOUR(Variable):

    @property
    def first_var_name(self):
        return "ARRIVE_HOUR_[(0,)]"

    @property
    def shape(self) -> int:
        return self.num_locations


@VARIABLE_REGISTRY.register("R_DEV")
class R_DEV(Variable):

    @property
    def first_var_name(self):
        ...

    @property
    def shape(self) -> int:
        return self.num_travelers


@VARIABLE_REGISTRY.register("S_DEV")
class S_DEV(Variable):

    @property
    def first_var_name(self):
        ...

    @property
    def shape(self) -> tuple[int, ...]:
        return self.num_travelers, self.num_locations


@VARIABLE_REGISTRY.register("I_DEV")
class I_DEV(Variable):

    @property
    def first_var_name(self):
        ...

    @property
    def shape(self) -> tuple[int, ...]:
        return self.num_travelers, self.num_locations, self.num_locations


@VARIABLE_REGISTRY.register("MEAN_R")
class MEAN_R(Variable):

    @property
    def first_var_name(self):
        return "MEAN_R_[(0,)]"

    @property
    def shape(self) -> int:
        return self.num_travelers


@VARIABLE_REGISTRY.register("INTER_R")
class INTER_R(Variable):

    @property
    def first_var_name(self):
        return "INTER_R_[(0,_0)]"

    @property
    def shape(self) -> tuple[int, ...]:
        return self.num_travelers, self.num_locations


@VARIABLE_REGISTRY.register("SUM_R")
class SUM_R(Variable):

    @property
    def first_var_name(self):
        return "SUM_R_[(0,)]"

    @property
    def shape(self) -> int:
        return self.num_travelers
