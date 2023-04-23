import datetime as dt
from typing import Optional, Union

import numpy as np
import googlemaps
from google.protobuf import timestamp_pb2

from tom.common import Location, Traveler
from tom.trip_manager.data_objects.solver import TripSolver
from tom.trip_manager import writer


class VarName:
    GO = "GO"
    FROM = "FROM"
    STAY = "STAY"
    TIME = "TIME"
    INTER_DEPART_DAY = "INTER_DEPART_DAY"
    INTER_DEPART_HOUR = "INTER_DEPART_HOUR"
    DEPART_DAY = "DEPART_DAY"
    DEPART_HOUR = "DEPART_HOUR"
    ARRIVE_DAY = "ARRIVE_DAY"
    ARRIVE_HOUR = "ARRIVE_HOUR"
    R_DEV = "R_DEV"
    S_DEV = "S_DEV"
    I_DEV = "I_DEV"
    MEAN_R = "MEAN_R"
    INTER_R = "INTER_R"
    SUM_R = "SUM_R"


class EnvVars:
    GMAPS_API_KEY = "GOOGLE_MAPS_API_KEY"


class Trip:

    def __init__(
            self,
            _id: str,
            start_date: Union[str, dt.datetime],
            end_date: Union[dt.datetime],
            start_location: dict,
            end_location: dict,
            google_maps_api_key: str
    ):
        self._id = _id
        self._start_date = self.parse_date_input(start_date)
        self._end_date = self.parse_date_input(end_date)
        self._locations: list[Location] = []
        self._travelers: list[Traveler] = []
        self._start_location = Location(**start_location)
        self._end_location = Location(**end_location)
        self._solver: Optional[TripSolver] = None
        self._gmaps_api_key = google_maps_api_key

    @property
    def id(self) -> str:
        return self._id

    @property
    def solver(self):
        return self._solver

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
    def trip_is_circular(self) -> bool:
        return self.start_location_index == self.end_location_index

    @property
    def travelers(self) -> list[Traveler]:
        return self._travelers

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
    def num_days(self) -> float:
        return self.total_trip_duration(unit="days")

    @property
    def num_hours(self) -> float:
        return self.total_trip_duration(unit="hours")
        
    def add_location(self, location: Union[Location, list[Location]]):
        """ Add location to trip.

        :param location: :class:`Location` instance or list of instances
        """
        if isinstance(location, list):
            self._locations.extend(location)
            return
        self._locations.append(location)

    def add_traveler(self, traveler: Union[Traveler, list[Traveler]]):
        """ Add traveler to trip.

        :param traveler: :class:`Traveler` instance or list of instances
        """
        if isinstance(traveler, list):
            self._travelers.extend(traveler)
            return
        self._travelers.append(traveler)

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
    def load_from_dict(cls, trip_dict: dict, google_maps_api_key: str):
        
        trip = cls(**trip_dict["trip"], google_maps_api_key=google_maps_api_key)
        for location_dict in trip_dict["locations"]:
            location = Location(**location_dict)
            trip.add_location(location)
        for traveler_dict in trip_dict["travelers"]:
            traveler = Traveler(**traveler_dict)
            trip.add_traveler(traveler)
        
        return trip

    def create_travel_matrix(self, gmaps_client, params: dict):
        response = gmaps_client.distance_matrix(
            self.location_lat_lons,
            self.location_lat_lons,
            departure_time=self.start_date,
            **params
        )
        return self.get_duration_from_gmap_response(response)

    def create_timezone_matrix(self, gmaps_client):
        timezones = []
        timezone_offsets = np.zeros((self.num_locations, self.num_locations))
        for lat_lon in self.location_lat_lons:
            response = gmaps_client.timezone(
                location=lat_lon,
                timestamp=self.start_date
            )
            timezones.append(response["rawOffset"] // 60**2)

        for i, j in np.ndindex(timezone_offsets.shape):
            timezone_offsets[i, j] = timezones[j] - timezones[i]

        return timezone_offsets

    def generate_mps_file(
        self,
        distance_matrix_params: dict
    ):

        gmaps_client = googlemaps.Client(key=self._gmaps_api_key)
        
        ##### Prepare input variables #####

        travel_matrix = self.create_travel_matrix(gmaps_client, distance_matrix_params)
        timezone_offsets = self.create_timezone_matrix(gmaps_client)
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

        ##### REQUIRED DECISION VARIABLES #####

        GO = solver.BoolArray(self.num_locations, VarName.GO)
        FROM = solver.BoolArray((self.num_locations, self.num_locations), VarName.FROM)
        INTER_DEPART_DAY = solver.IntArray(
            (self.num_locations, self.num_locations),
            VarName.INTER_DEPART_DAY,
            ub=self.num_days
        )
        INTER_DEPART_HOUR = solver.NumArray(
            (self.num_locations, self.num_locations),
            VarName.INTER_DEPART_HOUR,
            ub=latest_end
        )

        DEPART_DAY = solver.IntArray(self.num_locations, VarName.DEPART_DAY, ub=self.num_days)
        DEPART_HOUR = solver.NumArray(self.num_locations, VarName.DEPART_HOUR, ub=latest_end)
        ARRIVE_DAY = solver.IntArray(self.num_locations, VarName.ARRIVE_DAY, ub=self.num_days)
        ARRIVE_HOUR = solver.NumArray(self.num_locations, VarName.ARRIVE_HOUR, ub=latest_end)

        TIME = solver.NumArray(self.num_locations, VarName.TIME, ub=self.num_hours)
        STAY = solver.NumArray(self.num_locations, VarName.STAY, ub=self.num_hours)
        DURATION = solver.NumVar(lb=0, ub=self.num_hours, name="DURATION")
        NUM_STOPS = solver.IntVar(lb=0, ub=self.num_locations, name="NUM_STOPS")
        NUM_TRANSITS = solver.IntVar(lb=0, ub=self.num_locations, name="NUM_TRANSITS")

        ##### OPTIONAL GOAL VARIABLES #####

        R_DEV_Pos, R_DEV_Neg = solver.DeviationArray(self.num_travelers, VarName.R_DEV, ub=10)
        MEAN_R = solver.NumArray(self.num_travelers, VarName.MEAN_R, ub=10)
        INTER_R = solver.NumArray((self.num_travelers, self.num_locations), VarName.INTER_R, ub=self.num_locations * 10)
        SUM_R = solver.NumArray(self.num_travelers, VarName.SUM_R, ub=self.num_locations * 10)

        S_DEV_Pos, S_DEV_Neg = solver.DeviationArray(
            (self.num_travelers, self.num_locations), VarName.S_DEV, ub=self.num_hours
        )

        I_DEV_Pos, I_DEV_Neg, I_DEV_IS_Pos, I_DEV_IS_Neg = solver.DeviationArray(
            (self.num_travelers, self.num_locations, self.num_locations),
            VarName.I_DEV,
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

        if self.trip_is_circular:
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

        # had_subtours = True
        # # Continue solution attempts until solution without subtours is found
        # while had_subtours:
        #     solver.Solve()
        #     had_subtours = cu.find_and_eliminate_subtours(FROM, start_idx, solver)

        mps_string = solver.ExportModelAsMpsFormat()
        mps_filename = "{}.mps".format(self.id)
        writer.write_mps_file(mps_string, mps_filename)
        return mps_filename
