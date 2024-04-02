from __future__ import annotations

import logging
import datetime as dt
from typing import Optional, Union

import numpy as np

from tom.common import Location, Traveler, VARIABLE_REGISTRY
from tom.common.cloud_access import gmaps
from tom.trip_manager.solver import TripSolver

logger = logging.getLogger(__name__)

MIN_LOCATIONS = 2
MAX_LOCATIONS = 25
MIN_TRAVELERS = 1
MAX_TRAVELERS = 5


class VarName:
    pass


class TripManager:

    def __init__(
            self,
            *,
            trip: dict[str, Union[str, float, int]],
            locations: list[dict[str, Union[str, float, int]]],
            travelers: list[dict[str, Union[str, float, int]]]
    ):
        self._parse_trip(**trip)
        self._parse_locations(locations)
        self._parse_travelers(travelers)
        self.solver: Optional[TripSolver] = None

    def encode(self):
        _dict = {
            "id": self.id,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "start_location_index": self.start_location_index,
            "end_location_index": self.end_location_index,
            "locations": [location.encode() for location in self.locations],
            "travelers": [traveler.encode() for traveler in self.travelers]
        }
        return _dict

    def _parse_trip(
            self,
            *,
            id: str,
            start_date: str,
            end_date: str,
            start_location_index: int,
            end_location_index: int,
            trip_owner_id: str,
    ):
        self.id = id
        self.start_date = dt.datetime.fromisoformat(start_date)
        self.end_date = dt.datetime.fromisoformat(end_date)
        self.start_location_index = start_location_index
        self.end_location_index = end_location_index
        self.trip_owner_id = trip_owner_id
        self.is_circular = self.start_location_index == self.end_location_index
        self.is_linear = not self.is_circular
        self.trip_time_delta = self.end_date - self.start_date
        self.num_days = self.total_trip_duration(unit="days")
        self.num_hours = self.total_trip_duration(unit="hours")

    def _parse_locations(
            self,
            locations: list[dict[str, float]]
    ):
        if not (MIN_LOCATIONS <= len(locations) <= MAX_LOCATIONS):
            raise ValueError(f"Number of locations outside acceptable range of {(MIN_LOCATIONS, MAX_LOCATIONS)}.")

        self.locations = [Location(**location) for location in locations]
        self.num_locations = len(self.locations)

        if self.start_location_index not in range(self.num_locations) or isinstance(self.start_location_index, bool):
            raise IndexError("Start location index outside range of locations.")

        if self.end_location_index not in range(self.num_locations) or isinstance(self.end_location_index, bool):
            raise IndexError("End location index outside range of locations.")

        self.start_location = self.locations[self.start_location_index]
        self.end_location = self.locations[self.end_location_index]
        logging.info(
            "Parsed following locations:",
            extra={"locations": locations}
        )

    def _parse_travelers(
            self,
            travelers: list[dict[str, Union[str, float, int]]]
    ):
        if not (MIN_TRAVELERS <= len(travelers) <= MAX_TRAVELERS):
            raise ValueError(f"Number of travelers outside acceptable range of {(MIN_TRAVELERS, MAX_TRAVELERS)}.")

        trav_dict = {traveler["id"]: Traveler(**traveler) for traveler in travelers}
        self.trip_owner = trav_dict[self.trip_owner_id]
        self.travelers = list(trav_dict.values())
        self.num_travelers = len(self.travelers)

        rating_lens, desired_time_lens = set(), set()
        for traveler in self.travelers:
            rating_lens.add(len(traveler.location_ratings))
            desired_time_lens.add(len(traveler.desired_time_in_location))

        if rating_lens != {self.num_locations}:
            raise ValueError("Number of location ratings does not match number of locations.")

        if desired_time_lens != {self.num_locations}:
            raise ValueError("Number of desired times does not match number of locations.")

        logging.info(
            "Parsed following travelers:",
            extra={"travelers": travelers}
        )

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
    def location_lat_lons(self) -> list[tuple[float, float]]:
        return [location.lat_lon for location in self.locations]

    @property
    def traveler_location_ratings(self) -> np.ndarray:
        return np.array([traveler.location_ratings for traveler in self.travelers])

    @property
    def traveler_desired_time_in_location(self) -> np.ndarray:
        return np.array([traveler.desired_time_in_location for traveler in self.travelers])

    @property
    def traveler_travel_thresholds(self) -> np.ndarray:
        return np.array([traveler.road_travel_threshold for traveler in self.travelers])

    @property
    def traveler_earliest_starts(self) -> np.ndarray:
        return np.array([traveler.earliest_acceptable_start for traveler in self.travelers])

    @property
    def traveler_latest_ends(self) -> np.ndarray:
        return np.array([traveler.latest_acceptable_end for traveler in self.travelers])

    @property
    def traveler_active_times(self) -> tuple[np.ndarray, np.ndarray]:
        active_start = np.mean([traveler.active_stay_start for traveler in self.travelers])
        active_end = np.mean([traveler.active_stay_end for traveler in self.travelers])
        return active_start, active_end

    def generate_mps_string(
        self,
        distance_matrix_params: dict
    ):

        buffered_num_locations = self.num_locations + self.is_linear
        ##### Prepare Variable classes #####
        VARS = {}
        for var_name in VARIABLE_REGISTRY:
            setattr(VarName, var_name, var_name)
            VARS[var_name] = VARIABLE_REGISTRY[var_name](self.num_travelers, buffered_num_locations)

        ##### Prepare input variables #####
        travel_matrix = np.zeros((buffered_num_locations, buffered_num_locations))
        _travel_matrix = gmaps.create_duration_matrix(self.location_lat_lons, self.start_date, distance_matrix_params)
        travel_matrix[:self.num_locations, :self.num_locations] = _travel_matrix

        timezone_offsets = np.zeros((buffered_num_locations, buffered_num_locations))
        _timezone_offsets = gmaps.create_timezone_matrix(self.location_lat_lons, self.start_date)
        timezone_offsets[:self.num_locations, :self.num_locations] = _timezone_offsets

        max_travel: float = np.max(travel_matrix)
        np.fill_diagonal(travel_matrix, 2 * max_travel)

        root_node_idx = self.start_location_index if self.is_circular else self.num_locations

        traveler_rating_matrix = np.zeros((self.num_travelers, buffered_num_locations))
        _traveler_rating_matrix: np.ndarray = self.traveler_location_ratings
        traveler_mean_rating: np.ndarray = np.mean(_traveler_rating_matrix, axis=1)
        traveler_rating_matrix[:, :self.num_locations] = _traveler_rating_matrix

        traveler_time_matrix = np.zeros((self.num_travelers, buffered_num_locations))
        _traveler_time_matrix: np.ndarray = self.traveler_desired_time_in_location
        traveler_time_matrix[:, :self.num_locations] = _traveler_time_matrix
        location_min_time = np.min(traveler_time_matrix, axis=0)

        travel_thresh: np.ndarray = self.traveler_travel_thresholds
        abs_travel_thresh: int = np.max(travel_thresh)

        earliest_start: float = self.traveler_earliest_starts.mean()
        latest_end: float = self.traveler_latest_ends.mean()

        active_start, active_end = self.traveler_active_times
        active_hours = active_end - active_start

        traveler_stay_matrix = (traveler_time_matrix / 24) * active_hours
        location_min_stay = np.min(traveler_stay_matrix, axis=0)

        start_idx = self.start_location_index
        end_idx = self.end_location_index

        ##### Instantiate Model #####
        solver = TripSolver()
        self.solver = solver
        logger.info("TripSolver instantiated.")

        ##### REQUIRED DECISION VARIABLES #####
        GO = solver.BoolArray(VARS[VarName.GO].shape, name=VarName.GO)
        FROM = solver.BoolArray(VARS[VarName.FROM].shape, name=VarName.FROM)
        INTER_DEPART_DAY = solver.IntArray(
            VARS[VarName.INTER_DEPART_DAY].shape,
            name=VarName.INTER_DEPART_DAY,
            ub=self.num_days
        )
        INTER_DEPART_HOUR = solver.NumArray(
            VARS[VarName.INTER_DEPART_HOUR].shape,
            name=VarName.INTER_DEPART_HOUR,
            ub=latest_end
        )

        DEPART_DAY = solver.IntArray(VARS[VarName.DEPART_DAY].shape, name=VarName.DEPART_DAY, ub=self.num_days)
        DEPART_HOUR = solver.NumArray(VARS[VarName.DEPART_HOUR].shape, name=VarName.DEPART_HOUR, ub=latest_end)
        ARRIVE_DAY = solver.IntArray(VARS[VarName.ARRIVE_DAY].shape, name=VarName.ARRIVE_DAY, ub=self.num_days)
        ARRIVE_HOUR = solver.NumArray(VARS[VarName.ARRIVE_HOUR].shape, name=VarName.ARRIVE_HOUR, ub=latest_end)

        TIME = solver.NumArray(VARS[VarName.TIME].shape, name=VarName.TIME, ub=self.num_hours)
        STAY = solver.NumArray(VARS[VarName.STAY].shape, name=VarName.STAY, ub=self.num_hours)

        DURATION = solver.NumVar(lb=0, ub=self.num_hours, name="DURATION")
        NUM_STOPS = solver.IntVar(lb=0, ub=self.num_locations, name="NUM_STOPS")
        NUM_TRANSITS = solver.IntVar(lb=0, ub=self.num_locations, name="NUM_TRANSITS")

        ##### OPTIONAL GOAL VARIABLES #####

        R_DEV_Pos, R_DEV_Neg = solver.DeviationArray(VARS[VarName.R_DEV].shape, name=VarName.R_DEV, ub=10)
        MEAN_R = solver.NumArray(VARS[VarName.MEAN_R].shape, name=VarName.MEAN_R, ub=10)
        INTER_R = solver.NumArray(
            VARS[VarName.INTER_R].shape,
            name=VarName.INTER_R,
            ub=self.num_locations * 10
        )
        SUM_R = solver.NumArray(VARS[VarName.SUM_R].shape, name=VarName.SUM_R, ub=self.num_locations * 10)

        S_DEV_Pos, S_DEV_Neg = solver.DeviationArray(
            VARS[VarName.S_DEV].shape, name=VarName.S_DEV, ub=self.num_hours
        )

        I_DEV_Pos, I_DEV_Neg, I_DEV_IS_Pos, I_DEV_IS_Neg = solver.DeviationArray(
            VARS[VarName.I_DEV].shape,
            name=VarName.I_DEV,
            ub=max_travel,
            return_bools=True
        )
        logger.info("Decision variables instantiated.")

        ##### LOCATION CONSTRAINTS #####
        solver.AddConstraint(GO[root_node_idx] == 1, name="Must go to start_location")
        if self.is_linear:
            solver.AddConstraint(
                FROM[root_node_idx, start_idx] == 1, name="Must depart root node for start location"
            )
            solver.AddConstraint(
                FROM[end_idx, root_node_idx] == 1, name="Must depart end location for root node"
            )

        solver.AddConstraint(GO.sum() == NUM_STOPS, name="Sum of GO must equal NUM_STOPS")
        solver.AddConstraint(FROM.sum() == NUM_TRANSITS, name="Sum of FROM must equal NUM_TRANSITS")

        solver.ArrayConstraint(
            np.less_equal(travel_matrix * FROM, abs_travel_thresh, dtype=object),
            name_prefix=f"travel_time_leq_{abs_travel_thresh}"
        )

        solver.AddConstraint(
            TIME.sum() + (travel_matrix * FROM).sum() == DURATION,
            name="Sum of TIME and selected travel times must equal DURATION"
        )

        if self.is_linear:
            solver.AddConstraint(TIME[root_node_idx] == 0, name="Time in root node must be 0.")
            solver.AddConstraint(STAY[root_node_idx] == 0, name="Stay in root node must be 0.")
            solver.AddConstraint(DEPART_DAY[root_node_idx] == 0, name="Depart root node on day 0")

            solver.AddConstraint(
                DEPART_HOUR[root_node_idx] == earliest_start,
                name=f"Depart start location at hour {earliest_start}"
            )

        solver.AddConstraint(TIME[start_idx] == 0, name="Time in start_location must be 0.")
        solver.AddConstraint(STAY[start_idx] == 0, name="Stay in start_location must be 0.")
        solver.AddConstraint(DEPART_DAY[start_idx] == 0, name="Depart start location on day 0")

        solver.AddConstraint(
            DEPART_HOUR[start_idx] == earliest_start,
            name=f"Depart start location at hour {earliest_start}"
        )

        solver.ArrayConstraint(
            np.less_equal(DEPART_DAY, self.num_days * GO, dtype=object),
            name_prefix="Set ceiling for DEPART_DAY"
        )
        solver.ArrayConstraint(
            np.less_equal(ARRIVE_DAY, self.num_days * GO, dtype=object),
            name_prefix="Set ceiling for ARRIVE_DAY"
        )
        solver.ArrayConstraint(
            np.less_equal(ARRIVE_DAY, INTER_DEPART_DAY.sum(axis=0), dtype=object),
            name_prefix="Set target for ARRIVE_DAY"
        )
        solver.ArrayConstraint(
            np.greater_equal(
                ARRIVE_DAY,
                INTER_DEPART_DAY.sum(axis=0) - (1 - GO) * self.num_days,
                dtype=object
            ),
            name_prefix="Set floor for ARRIVE_DAY"
        )
        solver.ArrayConstraint(
            np.less_equal(DEPART_HOUR, latest_end * GO, dtype=object),
            name_prefix="Set ceiling for DEPART_HOUR"
        )
        solver.ArrayConstraint(
            np.greater_equal(DEPART_HOUR, earliest_start * GO, dtype=object),
            name_prefix="Set floor for DEPART_HOUR"
        )
        solver.ArrayConstraint(
            np.less_equal(ARRIVE_HOUR, latest_end * GO, dtype=object),
            name_prefix="Set ceiling for ARRIVE_HOUR"
        )

        arrive_hour_expr = INTER_DEPART_HOUR.sum(axis=0) + (FROM * (travel_matrix + timezone_offsets)).sum(axis=0)
        solver.ArrayConstraint(
            np.less_equal(ARRIVE_HOUR, arrive_hour_expr, dtype=object),
            name_prefix="Set target for ARRIVE_HOUR"
        )
        solver.ArrayConstraint(
            np.greater_equal(
                ARRIVE_HOUR,
                arrive_hour_expr - (1 - GO) * 24,
                dtype=object
            ),
            name_prefix="Set floor target for ARRIVE_HOUR"
        )
        solver.ArrayConstraint(
            np.greater_equal(ARRIVE_HOUR, earliest_start * GO, dtype=object),
            name_prefix="Set floor for ARRIVE_HOUR"
        )
        start_idxs = [start_idx] if self.is_circular else [start_idx, root_node_idx]
        solver.ArrayConstraint(
            np.less_equal(
                np.delete(TIME, start_idxs),
                np.delete(self.num_hours * GO, start_idxs),
                dtype=object
            ),
            name_prefix="Set ceiling for TIME"
        )
        solver.ArrayConstraint(
            np.greater_equal(
                np.delete(TIME, start_idxs),
                np.delete(location_min_time * GO, start_idxs),
                dtype=object
            ),
            name_prefix="Set floor for TIME"
        )
        solver.ArrayConstraint(
            np.less_equal(
                np.delete(STAY, start_idxs),
                np.delete(self.num_hours * GO, start_idxs),
                dtype=object
            ),
            name_prefix="Set ceiling for STAY"
        )
        solver.ArrayConstraint(
            np.greater_equal(
                np.delete(STAY, start_idxs),
                np.delete(location_min_stay * GO, start_idxs),
                dtype=object
            ),
            name_prefix="Set floor for STAY"
        )
        time_expr = 24 * (DEPART_DAY - ARRIVE_DAY) + DEPART_HOUR - ARRIVE_HOUR
        stay_expr = active_hours * (DEPART_DAY - ARRIVE_DAY) \
            + (DEPART_HOUR - (active_start * GO)) \
            + ((active_end * GO) - ARRIVE_HOUR)

        solver.ArrayConstraint(
            np.equal(
                np.delete(TIME, start_idxs),
                np.delete(time_expr, start_idxs),
                dtype=object
            ),
            name_prefix="TIME must equal (departure date - arrival date)"
        )
        solver.ArrayConstraint(
            np.less_equal(
                np.delete(STAY, start_idxs),
                np.delete(stay_expr, start_idxs),
                dtype=object
            ),
            name_prefix="Set target for STAY"
        )
        solver.ArrayConstraint(
            np.greater_equal(
                np.delete(STAY, start_idxs),
                np.delete(stay_expr, start_idxs) - (1 - np.delete(GO, start_idxs)) * self.num_hours,
                dtype=object
            ),
            name_prefix="Set target floor for STAY"
        )

        solver.ArrayConstraint(
            np.less_equal(INTER_DEPART_DAY, self.num_days * FROM, dtype=object),
            name_prefix="Set ceiling for INTER_DEPART_DAY"
        )
        solver.ArrayConstraint(
            np.less_equal(INTER_DEPART_DAY.T, DEPART_DAY, dtype=object),
            name_prefix="Set target for INTER_DEPART_DAY"
        )
        solver.ArrayConstraint(
            np.greater_equal(
                INTER_DEPART_DAY.T,
                DEPART_DAY - (1 - FROM.T) * self.num_days,
                dtype=object
            ),
            name_prefix="Set floor for INTER_DEPART_DAY"
        )

        solver.ArrayConstraint(
            np.less_equal(INTER_DEPART_HOUR, latest_end * FROM, dtype=object),
            name_prefix="Set ceiling for INTER_DEPART_HOUR"
        )
        solver.ArrayConstraint(
            np.less_equal(INTER_DEPART_HOUR.T, DEPART_HOUR, dtype=object),
            name_prefix="Set target for INTER_DEPART_HOUR"
        )
        solver.ArrayConstraint(
            np.greater_equal(
                INTER_DEPART_HOUR.T,
                DEPART_HOUR - (1 - FROM.T) * 24,
                dtype=object
            ),
            name_prefix="Set target floor for INTER_DEPART_HOUR"
        )

        solver.AddConstraint(
            np.less_equal(
                DURATION,
                self.num_hours,
                dtype=object
            ),
            name="DURATION must be <= total trip hours"
        )

        solver.AddConstraint(
            FROM[start_idx, :].sum() == 1,
            name="Trip must depart start location for another location."
        )

        solver.AddConstraint(
            FROM[:, end_idx].sum() == 1,
            name="Trip must depart some location for end location"
        )

        # FROM indices follow [depart_from, arrive_in] convention
        solver.ArrayConstraint(
            np.equal(
                FROM.sum(axis=0),
                GO,
                dtype=object
            ),
            name_prefix="Circular trip arrival-departure equivalence"
        )
        solver.ArrayConstraint(
            np.equal(
                FROM.sum(axis=1),
                GO,
                dtype=object
            ),
            name_prefix="Circular departure-arrival equivalence"
        )

        logger.info("Location constraints set.")

        ##### TRAVELER CONSTRAINTS #####
        solver.ArrayConstraint(
            np.equal(
                INTER_R.sum(axis=1),
                SUM_R,
                dtype=object
            ),
            name_prefix="INTER_R must equal SUM_R"
        )
        solver.ArrayConstraint(
            np.equal(
                (traveler_rating_matrix * GO).sum(axis=1),
                SUM_R,
                dtype=object
            ),
            name_prefix="Travelers ratings must equal SUM_R"
        )
        solver.ArrayConstraint(
            np.equal(
                MEAN_R - R_DEV_Pos + R_DEV_Neg,
                traveler_mean_rating,
                dtype=object
            ),
            name_prefix="MEAN_R deviational equivalence"
        )
        solver.ArrayConstraint(
            np.less_equal(
                INTER_R,
                (10 * self.num_locations) * GO,
                dtype=object
            ),
            name_prefix="Set ceiling for INTER_R"
        )
        solver.ArrayConstraint(
            np.less_equal(
                INTER_R.T,
                MEAN_R,
                dtype=object
            ),
            name_prefix="Set target value for INTER_R"
        )
        solver.ArrayConstraint(
            np.greater_equal(
                (INTER_R.T - MEAN_R).T,
                (GO - 1) * (10 * self.num_locations),
                dtype=object
            ),
            name_prefix="Set floor for INTER_R"
        )
        solver.ArrayConstraint(
            np.equal(
                STAY - S_DEV_Pos + S_DEV_Neg,
                traveler_stay_matrix,
                dtype=object
            ),
            name_prefix="STAY deviational equivalence"
        )
        solver.ArrayConstraint(
            np.less_equal(
                I_DEV_IS_Pos,
                FROM,
                dtype=object
            ),
            name_prefix="Set ceiling for I_DEV_IS_Pos"
        )
        solver.ArrayConstraint(
            np.less_equal(
                I_DEV_IS_Neg,
                FROM,
                dtype=object
            ),
            name_prefix="Set ceiling for I_DEV_IS_Neg"
        )
        solver.ArrayConstraint(
            np.equal(
                (travel_matrix * FROM) - I_DEV_Pos + I_DEV_Neg,
                travel_thresh.reshape(-1, 1, 1) * FROM,
                dtype=object
            ),
            name_prefix="I deviational equivalence"
        )
        logger.info("Traveler constraints set.")

        ##### OBJECTIVE FUNCTION #####
        # Trim start location from S_DEV_* matrices
        S_DEV_Neg_sliced = np.delete(S_DEV_Neg, start_idxs, axis=1)

        solver.Minimize(
            S_DEV_Neg_sliced.sum() + R_DEV_Neg.sum() + I_DEV_Pos.sum()
        )
        logger.info("Objective function set.")

        mps_string = solver.ExportModelAsMpsFormat()
        return mps_string

    @property
    def metadata(self):
        metadata = {
            "trip_id": self.id,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "start_location_id": str(self.start_location_index),
            "end_location_id": str(self.end_location_index),
            "num_locations": str(self.num_locations),
            "num_travelers": str(self.num_travelers),
            "traveler_ids": str([str(traveler.id) for traveler in self.travelers])
        }
        return metadata
