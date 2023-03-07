import os
import datetime as dt
from itertools import permutations
from dotenv import load_dotenv

import numpy as np
import googlemaps
from ortools.linear_solver import pywraplp

from .location import Location
from .traveler import Traveler


class Trip:

    def __init__(
            self,
            _id: str,
            start_date: str,
            end_date: str,
            start_location: dict,
            end_location: dict
    ):
        self._id = _id
        self._env = load_dotenv()
        if not self._env:
            raise EnvironmentError("Unable to load .env file")
        self._start_date = dt.datetime.strptime(start_date, "%m/%d/%Y")
        self._end_date = dt.datetime.strptime(end_date, "%m/%d/%Y")
        self._locations: list[Location] = []
        self._travelers: list[Traveler] = []
        self._start_location = Location(**start_location)
        self._end_location = Location(**end_location)
        self.itineraries: dict[dict[str, str]]
        

    @property
    def id(self) -> str:
        return self._id

    @property
    def start_date(self) -> dt.datetime:
        return self._start_date


    @property
    def end_date(self) -> dt.datetime:
        return self._end_date


    @property
    def locations(self) -> list[Location]:
        return self._locations

    
    @property
    def start_location(self) -> Location:
        return self._start_location

    
    @property
    def end_location(self) -> Location:
        return self._end_location


    @property
    def start_location_index(self) -> int:
        return self.locations.index(self.start_location)


    @property
    def end_location_index(self) -> int:
        return self.locations.index(self.end_location)


    @property
    def travelers(self) -> list[Traveler]:
        return self._travelers


    @property
    def solver(self):
        return self._solver


    @property
    def num_locations(self) -> int:
        return len(self.locations)
    

    @property
    def num_travelers(self) -> int:
        return len(self.travelers)

    @property
    def trip_time_delta(self) -> dt.timedelta:
        return self.end_date - self.start_date


    def total_trip_duration(self, *, unit: str = "seconds") -> float:
        match unit:
            case "seconds":
                return self.trip_time_delta.total_seconds()
            case "minutes":
                return self.trip_time_delta.total_seconds() / 60
            case "hours":
                return self.trip_time_delta.total_seconds() / 60**2
            case "days":
                return self.trip_time_delta.days
            case _:
                raise ValueError(f"time unit {unit} not recognized.")


    @property
    def num_days(self) -> int:
        return self.total_trip_duration(unit="days")

    @property
    def num_hours(self) -> float:
        return self.total_trip_duration(unit="hours")
        

    def add_location(self, location: Location):
        self._locations.append(location)


    def add_traveler(self, traveler: Traveler):
        self._travelers.append(traveler)


    @property
    def location_lat_lons(self) -> list[tuple[float, float]]:
        return [location.lat_lon for location in self.locations]


    @property
    def traveler_location_ratings(self) -> np.ndarray:
        return np.array([traveler.location_ratings for traveler in self.travelers])


    @property
    def traveler_desired_stay_in_location(self) -> np.ndarray:
        return np.array([traveler.desired_stay_in_location for traveler in self.travelers])


    @property
    def traveler_travel_thresholds(self) -> np.ndarray:
        return np.array([traveler.road_travel_threshold for traveler in self.travelers])


    @property
    def traveler_earliest_starts(self) -> np.ndarray:
        return np.array([traveler.earliest_acceptable_start for traveler in self.travelers])


    @property
    def traveler_latest_ends(self) -> np.ndarray:
        return np.array([traveler.latest_acceptable_end for traveler in self.travelers])


    def get_duration_from_gmap_response(self, response) -> np.ndarray:
        """Traverse the Google Maps Distance Matrix API response and get the
        duration of travel between locations in hours.

        :param response: the Google Maps Distance Matrix API response
        """
        durations = []
        for row in response["rows"]:
            for element in row["elements"]:
                durations.append(element["duration"]["value"])

        return np.array(durations).reshape(self.num_locations, self.num_locations) / 60**2

    @classmethod
    def load_from_dict(cls, trip_dict: dict):
        
        trip = cls(**trip_dict["trip"])
        for location_dict in trip_dict["locations"]:
            location = Location(**location_dict)
            trip.add_location(location)
        for traveler_dict in trip_dict["travelers"]:
            traveler = Traveler(**traveler_dict)
            trip.add_traveler(traveler)
        
        return trip

    @staticmethod
    def subtour(edges, stop_at) -> list[int]:
        unvisited = stop_at.tolist()
        cycle = range(len(stop_at)+1)  # initial length has 1 more city
        while unvisited:  # true if len(unvisited) > 0
            thiscycle = []
            neighbors = unvisited
            while neighbors:
                current = neighbors[0]
                thiscycle.append(current)
                unvisited.remove(current)
                neighbors = [j for j in edges[current] if j in unvisited]
            if len(cycle) > len(thiscycle):
                cycle = thiscycle
        return cycle


    def optimize(
        self,
        *,
        transport_mode: str = "driving"
    ):
        
        ##### Prepare input variables #####

        gmaps = googlemaps.Client(key=os.getenv("GOOGLE_MAPS_API_KEY"))

        location_coords: list[tuple[float, float]] = self.location_lat_lons

        maps_response = gmaps.distance_matrix(
                            location_coords,
                            location_coords,
                            avoid="tolls",
                            mode=transport_mode,
                            units="imperial",
                            departure_time=self.start_date,
                            traffic_model="best_guess"
                        )

        I = self.get_duration_from_gmap_response(maps_response)
        np.fill_diagonal(I, I.max() + 25)
        max_I = I.max()
        
        big_n = 10000

        n: int = self.num_locations
        m: int = self.num_travelers

        start_location: int = self.start_location_index
        end_location: int = self.end_location_index

        R: np.ndarray = self.traveler_location_ratings
        mean_R: np.ndarray = np.mean(R, axis=1)

        S: np.ndarray = self.traveler_desired_stay_in_location
        min_stays = S.min(axis=0)

        travel_thresh: np.ndarray = self.traveler_travel_thresholds
        abs_travel_thresh: int = travel_thresh.max() + 4

        earliest_start: float = self.traveler_earliest_starts.mean()
        latest_end: float = self.traveler_latest_ends.mean()

        ##### Model definition #####
        solver = pywraplp.Solver.CreateSolver("SCIP")

        ##### ATOMIC DECISION VARIABLES #####
        _empty_location_array = np.empty(n, dtype=object)
        _empty_traveler_array = np.empty(m, dtype=object)
        _empty_traveler_location_array = np.empty((m, n), dtype=object)
        _empty_traveler_ll_tensor = np.empty((m, n, n), dtype=object)

        GO = np.empty_like(_empty_location_array)
        FROM = np.empty((n, n), dtype=object)
        INTER_DEPART_DAY = np.empty_like(FROM)
        INTER_DEPART_HOUR = np.empty_like(FROM)
        R_DEV_Pos = np.empty_like(_empty_traveler_array)
        R_DEV_Neg = np.empty_like(_empty_traveler_array)
        R_DEV_IS_Pos = np.empty_like(_empty_traveler_array)
        R_DEV_IS_Neg = np.empty_like(_empty_traveler_array)
        S_DEV_Pos = np.empty_like(_empty_traveler_location_array)
        S_DEV_Neg = np.empty_like(_empty_traveler_location_array)
        S_DEV_IS_Pos = np.empty_like(_empty_traveler_location_array)
        S_DEV_IS_Neg = np.empty_like(_empty_traveler_location_array)
        I_DEV_Pos = np.empty_like(_empty_traveler_ll_tensor)
        I_DEV_Neg = np.empty_like(_empty_traveler_ll_tensor)
        I_DEV_IS_Pos = np.empty_like(_empty_traveler_ll_tensor)
        I_DEV_IS_Neg = np.empty_like(_empty_traveler_ll_tensor)

        DEPART_DAY = np.empty_like(_empty_location_array)
        DEPART_HOUR = np.empty_like(_empty_location_array)
        ARRIVE_DAY = np.empty_like(_empty_location_array)
        ARRIVE_HOUR = np.empty_like(_empty_location_array)

        ##### DERIVED DECISION VARIABLES #####
        STAY = np.empty_like(_empty_location_array)
        DURATION = solver.NumVar(
            lb=0, ub=self.num_hours, name="DURATION"
        )
        NUM_STOPS = solver.IntVar(lb=0, ub=n, name="NUM_STOPS")
        # TODO: Verify the upper bound for NUM_TRANSITS
        NUM_TRANSITS = solver.IntVar(lb=0, ub=n, name="NUM_TRANSITS")
        MEAN_R = np.empty_like(_empty_traveler_array)
        INTER_R = np.empty_like(_empty_traveler_location_array)

        SUM_R = np.empty_like(_empty_traveler_array)

        #### FILL IN VARIABLE ARRAYS #####

        for location_i in range(n):

            GO[location_i] = solver.BoolVar(f"GO_{location_i}")
            STAY[location_i] = solver.NumVar(lb=0, ub=self.num_hours, name=f"STAY_{location_i}")
            DEPART_DAY[location_i] = solver.IntVar(
                lb=0, ub=self.num_days, name=f"DEPART_DAY_{location_i}"
            )
            DEPART_HOUR[location_i] = solver.NumVar(
                lb=0, ub=latest_end, name=f"DEPART_HOUR_{location_i}"
            )
            ARRIVE_DAY[location_i] = solver.IntVar(
                lb=0, ub=self.num_days, name=f"ARRIVE_DAY_{location_i}"
            )
            ARRIVE_HOUR[location_i] = solver.NumVar(
                lb=0, ub=latest_end, name=f"ARRIVE_HOUR_{location_i}"
            )
            for location_j in range(n):
                FROM[location_i, location_j] = solver.BoolVar(f"FROM_({location_i},{location_j})")
                INTER_DEPART_DAY[location_i, location_j] = solver.IntVar(
                    lb=0, ub=self.num_days, name=f"INTER_DEPART_{location_i}_{location_j}"
                )
                INTER_DEPART_HOUR[location_i, location_j] = solver.NumVar(
                    lb=0, ub=latest_end, name=f"INTER_DEPART_{location_i}_{location_j}"
                )
        
        for traveler_i in range(m):
            
            # TODO: Find smaller upper bound for R_DEV_* variables
            R_DEV_Pos[traveler_i] = solver.NumVar(lb=0, ub=10, name=f"R_DEV_Pos_{traveler_i}")
            R_DEV_Neg[traveler_i] = solver.NumVar(lb=0, ub=10, name=f"R_DEV_Neg_{traveler_i}")
            R_DEV_IS_Pos[traveler_i] = solver.BoolVar(name=f"R_DEV_IS_Pos_{traveler_i}")
            R_DEV_IS_Neg[traveler_i] = solver.BoolVar(name=f"R_DEV_IS_Neg_{traveler_i}")
            
            # TODO: Find smaller upper bound for MEAN_R variables
            MEAN_R[traveler_i] = solver.NumVar(lb=0, ub=10, name=f"MEAN_R_{traveler_i}")

            # TODO: Find smaller upper bound for INTER_R variables
            SUM_R[traveler_i] = solver.NumVar(lb=0, ub=n*10, name=f"INTER_R_{traveler_i}")

            for location_j in range(n):

                INTER_R[traveler_i, location_j] = solver.NumVar(lb=0, ub=n*10, name=f"INTER_R_{traveler_i}_{location_j}")
                
                # TODO: Find smaller upper bound for S_DEV_* variables
                S_DEV_Pos[traveler_i, location_j] = solver.NumVar(
                    lb=0, ub=self.num_hours, name=f"S_DEV_Pos_{traveler_i}_{location_j}"
                )
                S_DEV_Neg[traveler_i, location_j] = solver.NumVar(
                    lb=0, ub=self.num_hours, name=f"S_DEV_Neg_{traveler_i}_{location_j}"
                )
                S_DEV_IS_Pos[traveler_i, location_j] = solver.BoolVar(
                    name=f"S_DEV_IS_Pos_{traveler_i}_{location_j}"
                )
                S_DEV_IS_Neg[traveler_i, location_j] = solver.BoolVar(
                    name=f"S_DEV_IS_Neg_{traveler_i}_{location_j}"
                )
                for l2 in range(n):
                    I_DEV_Pos[traveler_i, location_j, l2] = solver.NumVar(lb=0, ub=max_I, name=f"I_DEV_Pos[{traveler_i},{location_j},{l2}]")
                    I_DEV_Neg[traveler_i, location_j, l2] = solver.NumVar(lb=0, ub=max_I, name=f"I_DEV_Neg[{traveler_i},{location_j},{l2}]")
                    I_DEV_IS_Pos[traveler_i, location_j, l2] = solver.BoolVar(name=f"I_DEV_IS_Pos[{traveler_i},{location_j},{l2}]")
                    I_DEV_IS_Neg[traveler_i, location_j, l2] = solver.BoolVar(name=f"I_DEV_IS_Neg[{traveler_i},{location_j},{l2}]")

        ##### LOCATION CONSTRAINTS #####

        solver.Add(GO[start_location] == 1, name="Must go to start_location")
        solver.Add(GO[end_location] == 1, name="Must go to end_location")
        solver.Add(GO.sum() == NUM_STOPS, name="Sum of GO must equal NUM_STOPS")
        solver.Add(FROM.sum() == NUM_TRANSITS, name="Sum of FROM must equal NUM_TRANSITS")

        constraint_name = "If start and end locations are different, NUM_TRANSITS must equal 1 - NUM_TRANSITS"
        if start_location != end_location:
            solver.Add(NUM_TRANSITS == NUM_STOPS - 1, name=constraint_name)

        for location_i in range(n):
            for location_j in range(n):
                solver.Add(
                    I[location_i, location_j] * FROM[location_i, location_j] <= abs_travel_thresh,
                    name=f"Selected travel time from {location_i=} to {location_j=} must be <= {abs_travel_thresh} hours"
                )

        solver.Add(
            STAY.sum() + (I * FROM).sum() == DURATION,
            name="Sum of STAY and selected travel times must equal DURATION"
        )

        solver.Add(STAY[start_location] == 0, name="Stay in start_location must be 0.")
        solver.Add(DEPART_DAY[start_location] == 0, name="Depart start location on day 0")
        solver.Add(
            DEPART_HOUR[start_location] == earliest_start,
            name=f"Depart start location at hour {earliest_start}"
        )

        for location in range(n):

            solver.Add(
                DEPART_DAY[location] <= self.num_days * GO[location],
                name=f"Set ceiling for DEPART_DAY[{location}]"
            )
            solver.Add(
                ARRIVE_DAY[location] <= self.num_days * GO[location],
                name=f"Set ceiling for ARRIVE_DAY[{location}]"
            )
            solver.Add(
                ARRIVE_DAY[location] <= INTER_DEPART_DAY[:, location].sum(),
                name=f"Set target for ARRIVE_DAY[{location}]"
            )
            solver.Add(
                ARRIVE_DAY[location] >= INTER_DEPART_DAY[:, location].sum() - (1 - GO[location]) * self.num_days,
                name=f"Set floor for ARRIVE_DAY[{location}]"
            )
            solver.Add(
                DEPART_HOUR[location] <= latest_end * GO[location],
                name=f"Set ceiling for DEPART_HOUR[{location}]"
            )
            solver.Add(
                DEPART_HOUR[location] >= earliest_start * GO[location],
                name=f"Set floor for DEPART_HOUR[{location}]"
            )
            solver.Add(
                ARRIVE_HOUR[location] <= latest_end * GO[location],
                name=f"Set ceiling for ARRIVE_HOUR[{location}]"
            )
            solver.Add(
                ARRIVE_HOUR[location] <= INTER_DEPART_HOUR[:, location].sum() + (FROM[:, location] @ I[:, location]),
                name=f"Set target for ARRIVE_HOUR[{location}]"
            )
            solver.Add(
                ARRIVE_HOUR[location] >= (INTER_DEPART_HOUR[:, location].sum() + (FROM[:, location] @ I[:, location])) - (1 - GO[location]) * 24,
                name=f"Set floor target for ARRIVE_HOUR[{location}]"
            )
            solver.Add(
                ARRIVE_HOUR[location] >= earliest_start * GO[location],
                name=f"Set floor for ARRIVE_HOUR[{location}]"
            )

            if location != start_location:
                solver.Add(
                    STAY[location] <= self.num_hours * GO[location],
                    name=f"Set ceiling for STAY[{location}]"
                )
                solver.Add(
                    STAY[location] >= min_stays[location] * GO[location] ,
                    name=f"Set floor for STAY[{location}]"
                )
                solver.Add(
                    STAY[location] == (24*DEPART_DAY[location] + DEPART_HOUR[location]) - (24*ARRIVE_DAY[location] + ARRIVE_HOUR[location]),
                    name=f"STAY[{location}] must equal (departure date - arrival date)"
                )

            for l2 in range(n):
                solver.Add(
                    INTER_DEPART_DAY[location, l2] <= self.num_days * FROM[location, l2],
                    name=f"Set ceiling for INTER_DEPART_DAY[{location}, {l2}]"
                )
                solver.Add(
                    INTER_DEPART_DAY[location, l2] <= DEPART_DAY[location],
                    name=f"Set target value for INTER_DEPART_DAY[{location}, {l2}]"
                )
                solver.Add(
                    INTER_DEPART_DAY[location, l2] >= DEPART_DAY[location] - (1 - FROM[location, l2]) * self.num_days,
                    name=f"Set floor for INTER_DEPART_DAY[{location}, {l2}]"
                )
                solver.Add(
                    INTER_DEPART_HOUR[location, l2] <= latest_end * FROM[location, l2],
                    name=f"Set ceiling for INTER_DEPART_HOUR[{location}, {l2}]"
                )
                solver.Add(
                    INTER_DEPART_HOUR[location, l2] <= DEPART_HOUR[location],
                    name=f"Set target value for INTER_DEPART_HOUR[{location}, {l2}]"
                )
                solver.Add(
                    INTER_DEPART_HOUR[location, l2] >= DEPART_HOUR[location] - (1 - FROM[location, l2]) * 24
                )

        solver.Add(DURATION <= self.num_hours, name="DURATION must be <= total trip hours")

        for location in range(n):
            location_is_start = location == start_location
            location_is_end = location == end_location
            if location_is_start and not location_is_end:
                solver.Add(
                    FROM[:, location].sum() == 0,
                    name="Start location that is not also end location cannot be traveled to"
                )
                solver.Add(
                    FROM[location, :].sum() == 1,
                    name="Trip must depart start location to another location."
                )
            elif not location_is_start and location_is_end:
                solver.Add(
                    FROM[location, :].sum() == 0,
                    name="End location that is not also start location cannot be departed from"
                )
                solver.Add(
                    FROM[:, location].sum() == 1,
                    name="Trip must depart some location for end location"
                )
            else:
                solver.Add(
                    FROM[location, :].sum() == GO[location],
                    name=f"If travelling to {location=}, must depart it to another location"
                )
                solver.Add(
                    FROM[:, location].sum() == GO[location],
                    name=f"If travelling to {location=}, must arrive in it from another location"
                )

        ##### TRAVELER CONSTRAINTS #####

        for traveler in range(m):
            
            solver.Add(
                INTER_R[traveler, :].sum() == SUM_R[traveler],
                name=f"Sum of INTER_R[{traveler}, :] (-> MEAN_Rs or 0s) must equal SUM_R[{traveler}]"
            )
            solver.Add(
                R[traveler, :] @ GO == SUM_R[traveler],
                name=f"{traveler=}'s ratings of trip locations must equal SUM_R[{traveler}]"
            )
            solver.Add(
                R_DEV_Pos[traveler] <= big_n * R_DEV_IS_Pos[traveler],
                name=f"Set ceiling for R_DEV_Pos[{traveler}]"
            )
            solver.Add(
                R_DEV_Neg[traveler] <= big_n * R_DEV_IS_Neg[traveler],
                name=f"Set ceiling for R_DEV_Neg[{traveler}]"
            )
            solver.Add(
                R_DEV_IS_Pos[traveler] + R_DEV_IS_Neg[traveler] <= 1,
                name=f"Ensure only either R_DEV_IS_Pos[{traveler}] or R_DEV_IS_Neg[{traveler}] can be set to True"
            )
            solver.Add(
                MEAN_R[traveler] - R_DEV_Pos[traveler] + R_DEV_Neg[traveler] == mean_R[traveler],
                name=f"Ensure {traveler=}'s calculated MEAN_R +- the deviations equals their overall mean_R"
            )
            for location in range(n):
                solver.Add(
                    INTER_R[traveler, location] <= (10 * n) * GO[location],
                    name=f"Set ceiling for INTER_R[{traveler},{location}]"
                )
                solver.Add(
                    INTER_R[traveler, location] <= MEAN_R[traveler],
                    name=f"Set target value for INTER_R[{traveler},{location}] to MEAN_R[{traveler}]"
                )
                solver.Add(
                    INTER_R[traveler, location] >= MEAN_R[traveler] - (1 - GO[location]) * (10 * n),
                    name=f"Set floor for INTER_R[{traveler},{location}]"
                )
                solver.Add(
                    S_DEV_Pos[traveler, location] <= big_n * S_DEV_IS_Pos[traveler, location],
                    name=f"Set ceiling for S_DEV_Pos[{traveler},{location}]"
                )
                solver.Add(
                    S_DEV_Neg[traveler, location] <= big_n * S_DEV_IS_Neg[traveler, location],
                    name=f"Set ceiling for S_DEV_Neg[{traveler},{location}]"
                )
                solver.Add(
                    S_DEV_IS_Pos[traveler, location] + S_DEV_IS_Neg[traveler, location] <= 1,
                    name=f"Ensure only either S_DEV_IS_Pos[{traveler},{location}] or S_DEV_IS_Neg[{traveler},{location}] can be set to True"
                )
                solver.Add(
                    STAY[location] - S_DEV_Pos[traveler, location] + S_DEV_Neg[traveler, location] == S[traveler, location],
                    name=f"Ensure {location=}'s calculated STAY +- {traveler=}'s deviations equals their desired stay."
                )
                for l2 in range(n):
                    solver.Add(
                        I_DEV_IS_Neg[traveler, location, l2] <= FROM[location, l2],
                        name=f"Set ceiling for I_DEV_IS_Neg[{traveler},{location},{l2}]"
                    )
                    solver.Add(
                        I_DEV_IS_Pos[traveler, location, l2] <= FROM[location, l2],
                        name=f"Set ceiling for I_DEV_IS_Pos[{traveler},{location},{l2}]"
                    )
                    solver.Add(
                        I_DEV_Pos[traveler, location, l2] <= max_I * I_DEV_IS_Pos[traveler, location, l2],
                        name=f"Set ceiling for I_DEV_Pos[{traveler},{location},{l2}]"
                    )
                    solver.Add(
                        I_DEV_Neg[traveler, location, l2] <= max_I * I_DEV_IS_Neg[traveler, location, l2],
                        name=f"Set ceiling for I_DEV_Neg[{traveler},{location},{l2}]"
                    )
                    solver.Add(
                        I_DEV_IS_Pos[traveler, location, l2] + I_DEV_IS_Neg[traveler, location, l2] <= 1,
                        name=f"Ensure only either I_DEV_IS_Pos[{traveler},{location},{l2}] or I_DEV_IS_Neg[{traveler},{location},{l2}] can be set to True"
                    )
                    solver.Add(
                        (I[location, l2] * FROM[location, l2]) + I_DEV_Neg[traveler, location, l2] - I_DEV_Pos[traveler, location, l2] == travel_thresh[traveler] * FROM[location, l2]

                    )

        ##### OBJECTIVE FUNCTION #####
        # Trim start location from S_DEV_* matrices
        S_DEV_Neg_sliced = np.delete(S_DEV_Neg, start_location, axis=1)

        solver.Minimize(
            S_DEV_Neg_sliced.sum() + R_DEV_Neg.sum() + I_DEV_Pos.sum()
        )

        tour, NUM_STOPS_sol = [], 1

        # Continue solution attempts until solution without subtours is found
        while len(tour) < NUM_STOPS_sol:

            status = solver.Solve()
            GO_sol = np.array([val.solution_value() for val in GO])
            FROM_sol = np.array([val.solution_value() for val in FROM.flatten()]).reshape(n, n)
            stops = GO_sol.nonzero()[0]
            NUM_STOPS_sol = NUM_STOPS.solution_value()
            selected = {}
            for l1 in range(n):
                selected[l1] = []
                for l2 in range(n):
                    if FROM_sol[l1, l2]:
                        selected[l1].append(l2)
            tour = self.subtour(selected, stops)
            if len(tour) < NUM_STOPS_sol:
                if len(tour) == 2:
                    i, j = tour
                    solver.Add(FROM[i, j] + FROM[j, i] <= len(tour) - 1)
                else:
                    solver.Add(
                        sum(FROM[i, j] for i, j in permutations(tour, 2)) <= len(tour) - 1
                    )

        AD = [d.solution_value() for d in ARRIVE_DAY]
        AH = [d.solution_value() for d in ARRIVE_HOUR]
        DD = [d.solution_value() for d in DEPART_DAY]
        DH = [d.solution_value() for d in DEPART_HOUR]

        IDD = np.array([i.solution_value() for i in INTER_DEPART_DAY.flatten()]).reshape(n, n)
        IDH = np.array([i.solution_value() for i in INTER_DEPART_HOUR.flatten()]).reshape(n, n)
        F = np.array([f.solution_value() for f in FROM.flatten()]).reshape(n, n)

        IDP = np.array([i.solution_value() for i in I_DEV_Pos.flatten()]).reshape(m, n, n)
        IDN = np.array([i.solution_value() for i in I_DEV_Neg.flatten()]).reshape(m, n, n)

        return solver
