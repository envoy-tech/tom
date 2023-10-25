from __future__ import annotations
import datetime as dt
from typing import Optional, Union
import json

import numpy as np

from tom.common import Location, Traveler, VARIABLE_REGISTRY
from tom.common.cloud_access import gmaps
from tom.trip_manager.solver import TripSolver


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
        start_location_id, end_location_id, trip_owner_id = self._parse_trip(**trip)
        self._parse_locations(locations, start_location_id, end_location_id)
        self._parse_travelers(travelers, trip_owner_id)
        self.solver: Optional[TripSolver] = None

    def _parse_trip(
            self,
            _id: str,
            start_date: str,
            end_date: str,
            start_location_id: str,
            end_location_id: str,
            trip_owner_id: str,
    ):
        self.id = _id
        self.start_date = self.parse_date_input(start_date)
        self.end_date = self.parse_date_input(end_date)
        return start_location_id, end_location_id, trip_owner_id

    def _parse_locations(
            self,
            locations: list[dict[str, Union[str, float, int]]],
            start_location_id: str,
            end_location_id: str
    ):
        loc_dict = {location["_id"]: Location(**location) for location in locations}
        self.start_location = loc_dict[start_location_id]
        self.end_location = loc_dict[end_location_id]
        self.locations = list(loc_dict.values())

    def _parse_travelers(
            self,
            travelers: list[dict[str, Union[str, float, int]]],
            trip_owner_id: str
    ):
        trav_dict = {traveler["_id"]: Traveler(**traveler) for traveler in travelers}
        self.trip_owner = trav_dict[trip_owner_id]
        self.travelers = list(trav_dict.values())

    @property
    def start_location_index(self) -> int:
        return self.locations.index(self.start_location)

    @property
    def end_location_index(self) -> int:
        return self.locations.index(self.end_location)
    
    @property
    def is_circular(self) -> bool:
        return self.start_location_index == self.end_location_index

    @property
    def num_locations(self) -> int:
        return len(self.locations)
    
    @property
    def num_travelers(self) -> int:
        return len(self.travelers)

    @property
    def trip_time_delta(self) -> dt.timedelta:
        return self.end_date - self.start_date

    @property
    def num_days(self) -> float:
        return self.total_trip_duration(unit="days")

    @property
    def num_hours(self) -> float:
        return self.total_trip_duration(unit="hours")

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

    @staticmethod
    def parse_date_input(date_input):
        if isinstance(date_input, str):
            return dt.datetime.strptime(date_input, "%m/%d/%Y")
        return date_input

    def generate_mps_string(
        self,
        distance_matrix_params: dict
    ):
        ##### Prepare Variable classes #####
        VARS = {}
        for var_name in VARIABLE_REGISTRY:
            setattr(VarName, var_name, var_name)
            VARS[var_name] = VARIABLE_REGISTRY[var_name](self.num_travelers, self.num_locations)

        ##### Prepare input variables #####

        travel_matrix = gmaps.create_duration_matrix(self.location_lat_lons, self.start_date, distance_matrix_params)
        timezone_offsets = gmaps.create_timezone_matrix(self.location_lat_lons, self.start_date)
        max_travel: float = np.max(travel_matrix)
        np.fill_diagonal(travel_matrix, 2 * max_travel)

        start_idx: int = self.start_location_index
        end_idx: int = self.end_location_index

        traveler_rating_matrix: np.ndarray = self.traveler_location_ratings
        traveler_mean_rating: np.ndarray = np.mean(traveler_rating_matrix, axis=1)

        traveler_time_matrix: np.ndarray = self.traveler_desired_time_in_location
        location_min_time = np.min(traveler_time_matrix, axis=0)

        travel_thresh: np.ndarray = self.traveler_travel_thresholds
        abs_travel_thresh: int = np.max(travel_thresh)

        earliest_start: float = self.traveler_earliest_starts.mean()
        latest_end: float = self.traveler_latest_ends.mean()

        active_start, active_end = self.traveler_active_times
        active_hours = active_end - active_start

        traveler_stay_matrix = (traveler_time_matrix / 24) * active_hours
        location_min_stay = np.min(traveler_stay_matrix, axis=0)

        ##### Instantiate Model #####

        solver = TripSolver()
        self.solver = solver

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

        # TODO: Come back and find better way to handle logging these variable indices
        DURATION = solver.NumVar(lb=0, ub=self.num_hours, name="DURATION")
        solver.var_indices["DURATION"] = (DURATION.index())
        NUM_STOPS = solver.IntVar(lb=0, ub=self.num_locations, name="NUM_STOPS")
        solver.var_indices["NUM_STOPS"] = (NUM_STOPS.index())
        NUM_TRANSITS = solver.IntVar(lb=0, ub=self.num_locations, name="NUM_TRANSITS")
        solver.var_indices["NUM_TRANSITS"] = (NUM_TRANSITS.index())

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

        ##### LOCATION CONSTRAINTS #####

        solver.AddConstraint(GO[start_idx] == 1, name="Must go to start_location")
        solver.AddConstraint(GO.sum() == NUM_STOPS, name="Sum of GO must equal NUM_STOPS")
        solver.AddConstraint(FROM.sum() == NUM_TRANSITS, name="Sum of FROM must equal NUM_TRANSITS")

        constraint_name = "If start and end locations are different, NUM_TRANSITS must equal NUM_STOPS - 1"
        if start_idx != end_idx:
            solver.AddConstraint(NUM_TRANSITS == NUM_STOPS - 1, name=constraint_name)
            solver.AddConstraint(GO[end_idx] == 1, name="Must go to end_location")

        solver.ArrayConstraint(
            np.less_equal(travel_matrix * FROM, abs_travel_thresh, dtype=object),
            name_prefix=f"travel_time_leq_{abs_travel_thresh}"
        )

        solver.AddConstraint(
            TIME.sum() + (travel_matrix * FROM).sum() == DURATION,
            name="Sum of TIME and selected travel times must equal DURATION"
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
        solver.ArrayConstraint(
            np.less_equal(
                np.delete(TIME, start_idx),
                np.delete(self.num_hours * GO, start_idx),
                dtype=object
            ),
            name_prefix="Set ceiling for TIME"
        )
        solver.ArrayConstraint(
            np.greater_equal(
                np.delete(TIME, start_idx),
                np.delete(location_min_time * GO, start_idx),
                dtype=object
            ),
            name_prefix="Set floor for TIME"
        )
        solver.ArrayConstraint(
            np.less_equal(
                np.delete(STAY, start_idx),
                np.delete(self.num_hours * GO, start_idx),
                dtype=object
            ),
            name_prefix="Set ceiling for STAY"
        )
        solver.ArrayConstraint(
            np.greater_equal(
                np.delete(STAY, start_idx),
                np.delete(location_min_stay * GO, start_idx),
                dtype=object
            ),
            name_prefix="Set floor for STAY"
        )
        time_expr = (24 * DEPART_DAY + DEPART_HOUR) - (24 * ARRIVE_DAY + ARRIVE_HOUR)

        stay_expr = active_hours * (DEPART_DAY - ARRIVE_DAY) \
            + (DEPART_HOUR - (active_start * GO)) \
            + ((active_end * GO) - ARRIVE_HOUR)

        solver.ArrayConstraint(
            np.equal(
                np.delete(TIME, start_idx),
                np.delete(time_expr, start_idx),
                dtype=object
            ),
            name_prefix="TIME must equal (departure date - arrival date)"
        )
        solver.ArrayConstraint(
            np.less_equal(
                np.delete(STAY, start_idx),
                np.delete(stay_expr, start_idx),
                dtype=object
            ),
            name_prefix="Set target for STAY"
        )
        solver.ArrayConstraint(
            np.greater_equal(
                np.delete(STAY, start_idx),
                np.delete(stay_expr, start_idx) - (1 - np.delete(GO, start_idx)) * self.num_hours,
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

        middle_FROM = np.delete(FROM, [start_idx, end_idx], axis=1)
        middle_GO = np.delete(GO, [start_idx, end_idx])

        if self.is_circular:
            middle_FROM = FROM
            middle_GO = GO
        else:
            solver.AddConstraint(
                FROM[:, start_idx].sum() == 0,
                name="Start location that is not also end location cannot be traveled to"
            )
            solver.AddConstraint(
                FROM[start_idx, :].sum() == 1,
                name="Trip must depart start location for another location."
            )
            solver.AddConstraint(
                FROM[:, end_idx].sum() == 1,
                name="End location that is not also start location cannot be departed from."
            )
            solver.AddConstraint(
                FROM[end_idx, :].sum() == 0,
                name="Trip must arrive in end location."
            )

        solver.ArrayConstraint(
            np.equal(
                middle_FROM.sum(axis=0),
                middle_GO,
                dtype=object
            ),
            name_prefix="Arrival-departure equivalence"
        )
        solver.ArrayConstraint(
            np.equal(
                middle_FROM.sum(axis=1),
                middle_GO,
                dtype=object
            ),
            name_prefix="Departure-arrival equivalence"
        )

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

        ##### OBJECTIVE FUNCTION #####
        # Trim start location from S_DEV_* matrices
        S_DEV_Neg_sliced = np.delete(S_DEV_Neg, start_idx, axis=1)

        solver.Minimize(
            S_DEV_Neg_sliced.sum() + R_DEV_Neg.sum() + I_DEV_Pos.sum()
        )

        mps_string = solver.ExportModelAsMpsFormat()
        return mps_string

    @property
    def metadata(self):

        json_metadata = {
            "trip_id": str(self.id),
            "start_date": str(self.start_date),
            "end_date": str(self.end_date),
            "start_location_id": str(self.start_location_index),
            "end_location_id": str(self.end_location_index),
            "num_locations": str(self.num_locations),
            "location_ids": str([location.id for location in self.locations]),
            "num_travelers": str(self.num_travelers),
            "var_idxs": str(self.solver.var_indices)
        }

        return json_metadata
