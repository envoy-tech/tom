from typing import Union, Optional
from itertools import permutations

import numpy as np
from ortools.linear_solver import pywraplp


def make_deviational_variables(
        shape: Union[int, tuple[int, ...]],
        name_prefix: str,
        solver: pywraplp.Solver,
        *,
        lb: Union[int, float] = 0,
        ub: Union[int, float] = pywraplp.Solver.infinity(),
        return_bools: bool = False
    ) -> list[np.ndarray]:
    """Convenience function to create deviational variables for any model goals.

    Function automatically implements the basic constraints on all deviational variables, i.e.
    
    - is_neg + is_pos <= 1
    - pos <= ub * is_pos
    - neg <= ub * is_neg

    Other constraints on the variables can be added after the fact with the output of this function.

    :param shape: shape of the desired output variable arrays
    :param name_prefix: name prefix for all variables
    :param solver: the OR-tools solver instance to add variables / constraints to
    :param lb: lower bound of variables (default: 0)
    :param ub: upper bound of variables (default: inf)
    :param return_bools: flag to return the is_pos and is_neg boolean variables that constrain
                        the other deviational variables
    """

    class DeviationalVariableSuffix:
        POS = "pos"
        NEG = "neg"
        IS_POS = "is_pos"
        IS_NEG = "is_neg"

    pos, pos_name = np.empty(shape, dtype=object), f"{name_prefix}_{DeviationalVariableSuffix.POS}"
    neg, neg_name = np.empty_like(pos), f"{name_prefix}_{DeviationalVariableSuffix.NEG}"
    is_pos, is_pos_name = np.empty_like(pos), f"{name_prefix}_{DeviationalVariableSuffix.IS_POS}"
    is_neg, is_neg_name = np.empty_like(pos), f"{name_prefix}_{DeviationalVariableSuffix.IS_NEG}"
    
    for idx in np.ndindex(shape):

        # Create all necesary deviational variables
        pos[idx] = solver.NumVar(lb=lb, ub=ub, name=pos_name)
        neg[idx] = solver.NumVar(lb=lb, ub=ub, name=neg_name)
        is_pos[idx] = solver.BoolVar(name=is_pos_name)
        is_neg[idx] = solver.BoolVar(name=is_neg_name)

        # Add required deviational constraints
        solver.Add(is_pos[idx] + is_neg[idx] <= 1, name=f"{name_prefix}_[{idx}] deviational constraint")
        solver.Add(pos[idx] <= ub * is_pos[idx], name=f"set_ceiling_for_{name_prefix}_pos_[{idx}]")
        solver.Add(neg[idx] <= ub * is_neg[idx], name=f"set_ceiling_for_{name_prefix}_neg_[{idx}]")

    out = [pos, neg]
    
    if return_bools:
        out.extend([is_pos, is_neg])
    
    return out


def get_solution_array(array: np.ndarray) -> np.ndarray:
    """Take array of OR-tools variables and conver to array of plaintext solution values.
    
    :param array: input array of OR-tools variables
    """
    return np.array([v.solution_value() for v in array.flatten()]).reshape(*array.shape)


def find_subtours(departure_matrix: np.ndarray, start_location: int) -> list[int]:
    """Assess feasible solution and find any subtours.
    
    A subtour is defined as a closed cycle of departures that occur within a trip.
    A trip needs to be one continuous cycle, so, if this is not achieved, we must
    setup additional constraints to force to solver to find a new solution.

    :param departure_matrix: the feasible solution values from the FROM matrix
    :param start_location: the starting location for the trip
    """
    departures: dict[int, int] = parse_departures(departure_matrix)
    unvisited: np.ndarray = departure_matrix.nonzero()[0]
    continuous_trip_size = len(unvisited)
    subtours = []
    curr_location = start_location
    while len(unvisited):
        subtour = []
        has_unvisited_destination = True
        while has_unvisited_destination:
            subtour.append(curr_location)
            curr_loc_idx = unvisited.tolist().index(curr_location)
            unvisited = np.delete(unvisited, curr_loc_idx)
            next_location = departures[curr_location]
            has_unvisited_destination = True if next_location in unvisited else False
            curr_location = next_location

        if len(subtour) < continuous_trip_size:
            subtours.append(subtour)

    return subtours


def eliminate_subtours(subtours: list[list[int]], FROM: np.ndarray, solver):
    """Eliminate found subtours via new constraints.
    
    :param subtours: list of all subtours found in feasible solution
    :param FROM: FROM departure matrix
    :param solver: the OR-tools solver instance to add constraints to
    """
    for subtour in subtours:
        name = f"Eliminate subtour for cities {subtour}"
        if len(subtour) == 2:
            i, j = subtour
            solver.Add(FROM[i, j] + FROM[j, i] <= 1, name=name)
        else:
            solver.Add(
                sum(FROM[i, j] for i, j in permutations(subtour, 2)) <= len(subtour) - 1,
                name=name
            )


def parse_departures(departure_matrix: np.ndarray) -> dict[int, list[int]]:
    """Parse the departure matrix to determine from which cities trip will depart from
    and to where.

    :param departure_matrix: the departure matrix, i.e. feasible solution of FROM matrix
    """
    return {i: j for i, j in zip(*departure_matrix.nonzero())}


def find_and_eliminate_subtours(FROM: np.ndarray, start_location: int, solver):
    """Find any subtours in this feasible solution and eliminate them via new constraints.
    
    :param FROM: the FROM departure matrix
    :param start_location: the trip's starting location
    """
    departure_matrix = get_solution_array(FROM)
    subtours = find_subtours(departure_matrix, start_location)
    had_subtours = False
    if subtours:
        eliminate_subtours(subtours, FROM, solver)
        had_subtours = True
    
    return had_subtours
