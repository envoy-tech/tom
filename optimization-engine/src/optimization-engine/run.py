import json
from typing import Union

import numpy as np

from tom.common.cloud_access import aws_access
from tom.common.variable import _VarShape, VarShape, VarName
from optimization_engine import OptimizeMPSFile, SolutionContainer


class VarShapeMap:

    def __init__(self, num_travelers: int, num_locations: int):
        self.num_travelers = num_travelers
        self.num_locations = num_locations

    def __getitem__(self, item: _VarShape) -> Union[int, tuple[int, ...]]:
        if item == _VarShape.NUM_LOCATIONS:
            return self.num_locations
        elif item == _VarShape.NUM_TRAVELERS:
            return self.num_travelers
        elif item == _VarShape.LOC_ARRAY:
            return self.num_locations, self.num_locations
        elif item == _VarShape.TRAV_LOC_ARRAY:
            return self.num_travelers, self.num_locations
        elif item == _VarShape.TRAV_LOC_TENSOR:
            return self.num_travelers, self.num_locations, self.num_locations
        else:
            raise ValueError(f"Invalid _VarShape: {item}")


def get_variable_solution(
        variable_name: str,
        variable_values: list[Union[int, float]],
        variable_idxs: dict[str, int],
        variable_shape: Union[int, tuple[int, ...]]
) -> Union[int, float, np.ndarray]:

    idx: Union[int, tuple[int, int]] = variable_idxs[variable_name]
    if isinstance(idx, int):
        return variable_values[idx]
    else:
        start_idx, end_idx = idx
        return np.array(variable_values[start_idx:end_idx+1]).reshape(variable_shape)


def parse_route(travel_matrix: np.ndarray, start_id: int) -> list[int]:
    depart, arrive = travel_matrix.nonzero()
    route = [start_id]
    curr_id = np.where(depart == start_id)
    while len(route) < len(depart) - 1:

        next_idx = arrive[curr_idx]
        route.append(next_idx)
        curr_idx = next_idx



def generate_itineraries(filename: str, metadata: dict):
    """ Generate itineraries from MPS file

    :param filename: MPS file name
    :param metadata: metadata associated with MPS file
    :return: list of itineraries
    """
    solution_container: SolutionContainer = OptimizeMPSFile(filename)

    solutions = json.loads(solution_container.solutions)

    var_idxs = metadata["var_idxs"]
    start_idx = metadata["start_location_id"]
    end_idx = metadata["end_location_id"]
    num_locations = metadata["num_locations"]
    num_travelers = metadata["num_travelers"]

    shape_map = VarShapeMap(num_travelers, num_locations)

    itineraries = []
    for solution in solutions:
        var_values = solution["variableValue"]
        itinerary = {}
        itinerary["start_location"] = start_idx
        itinerary["end_location"] = end_idx

        GO = get_variable_solution(
            VarName.GO, var_values, var_idxs, shape_map[VarShape.GO]
        )
        FROM = get_variable_solution(
            VarName.FROM, var_values, var_idxs, shape_map[VarShape.FROM]
        )
        DEPART_DAY = get_variable_solution(
            VarName.DEPART_DAY, var_values, var_idxs, shape_map[VarShape.DEPART_DAY]
        )
        DEPART_HOUR = get_variable_solution(
            VarName.DEPART_HOUR, var_values, var_idxs, shape_map[VarShape.DEPART_HOUR]
        )
        ARRIVE_DAY = get_variable_solution(
            VarName.ARRIVE_DAY, var_values, var_idxs, shape_map[VarShape.ARRIVE_DAY]
        )
        ARRIVE_HOUR = get_variable_solution(
            VarName.ARRIVE_HOUR, var_values, var_idxs, shape_map[VarShape.ARRIVE_HOUR]
        )
        itinerary["location_ids"] = GO.nonzero()







