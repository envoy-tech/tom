from itertools import permutations

import numpy as np

from tom.data_objects.solver import TripSolver


def get_solution_array(array: np.ndarray) -> np.ndarray:
    """Take array of OR-tools variables and conver to array of plaintext solution values.
    
    :param array: input array of OR-tools variables
    """
    return np.array([v.solution_value() for v in array.flatten()]).reshape(*array.shape)


def find_subtours(departure_matrix: np.ndarray, start_location: int) -> list[list[int]]:
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
            curr_loc_idx = list(unvisited).index(curr_location)
            unvisited = np.delete(unvisited, curr_loc_idx)
            next_location = departures[curr_location]
            has_unvisited_destination = True if next_location in unvisited else False
            curr_location = next_location

        if len(subtour) < continuous_trip_size:
            subtours.append(subtour)

    return subtours


def eliminate_subtours(subtours: list[list[int]], FROM: np.ndarray, solver: TripSolver):
    """Eliminate found subtours via new constraints.
    
    :param subtours: list of all subtours found in feasible solution
    :param FROM: FROM departure matrix
    :param solver: the OR-tools solver instance to add constraints to
    """
    for subtour in subtours:
        name = f"Eliminate subtour for cities {subtour}"
        if len(subtour) == 2:
            i, j = subtour
            solver.AddConstraint(FROM[i, j] + FROM[j, i] <= 1, name=name)
        else:
            solver.AddConstraint(
                sum(FROM[i, j] for i, j in permutations(subtour, 2)) <= len(subtour) - 1,
                name=name
            )


def parse_departures(departure_matrix: np.ndarray) -> dict[int, int]:
    """Parse the departure matrix to determine from which cities trip will depart from
    and to where.

    :param departure_matrix: the departure matrix, i.e. feasible solution of FROM matrix
    """
    return {i: j for i, j in zip(*departure_matrix.nonzero())}


def find_and_eliminate_subtours(FROM: np.ndarray, start_location: int, solver: TripSolver):
    """Find any subtours in this feasible solution and eliminate them via new constraints.
    
    :param FROM: the FROM departure matrix
    :param start_location: the trip's starting location
    :param solver: solver instance to add constraints to
    """
    departure_matrix = get_solution_array(FROM)
    subtours = find_subtours(departure_matrix, start_location)
    had_subtours = False
    if subtours:
        eliminate_subtours(subtours, FROM, solver)
        had_subtours = True
    
    return had_subtours
