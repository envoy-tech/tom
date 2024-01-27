from __future__ import annotations


MIN_RATING = 0
MAX_RATING = 10
MIN_TIME = 0
MAX_TIME = 24
ACCEPTABLE_NUMERIC_TYPES = {int, float}


class Traveler:
    """Container for traveler's trip preferences."""

    def __init__(
            self,
            *,
            id: str,
            location_ratings: list[int],
            desired_time_in_location: list[int],
            road_travel_threshold: int,
            earliest_acceptable_start: int,
            latest_acceptable_end: int,
            allowed_start_flexibility: int,
            allowed_end_flexibility: int,
            active_stay_start: float,
            active_stay_end: float,
    ):
        self.id = id
        self.location_ratings = location_ratings
        self.desired_time_in_location = desired_time_in_location
        self.road_travel_threshold = road_travel_threshold
        self.earliest_acceptable_start = earliest_acceptable_start
        self.latest_acceptable_end = latest_acceptable_end
        self.allowed_start_flexibility = allowed_start_flexibility
        self.allowed_end_flexibility = allowed_end_flexibility
        self.active_stay_start = active_stay_start
        self.active_stay_end = active_stay_end
        self.validate_arg_types()
        self.validate_arg_values()

    def validate_arg_types(self):
        for attr, value in self.encode().items():
            match attr:
                case "id":
                    if not isinstance(value, str):
                        raise TypeError(f"{attr} must be of type str")
                case "location_ratings":
                    for rating in value:
                        if type(rating) not in ACCEPTABLE_NUMERIC_TYPES:
                            raise TypeError(f"{attr} must be of type {ACCEPTABLE_NUMERIC_TYPES}")
                case "desired_time_in_location":
                    for time in value:
                        if type(time) not in ACCEPTABLE_NUMERIC_TYPES:
                            raise TypeError(f"{attr} must be of type {ACCEPTABLE_NUMERIC_TYPES}")
                case _:
                    if type(value) not in ACCEPTABLE_NUMERIC_TYPES:
                        raise TypeError(f"{attr} must be of type {ACCEPTABLE_NUMERIC_TYPES}")

    def validate_arg_values(self):
        for attr, value in self.encode().items():
            match attr:
                case "id":
                    pass
                case "location_ratings":
                    for rating in value:
                        if not MIN_RATING <= rating <= MAX_RATING:
                            raise ValueError(f"{attr} must be between {MIN_RATING} and {MAX_RATING}")
                case "desired_time_in_location":
                    for time in value:
                        if MIN_TIME > time:
                            raise ValueError(f"{attr} must be greater than or equal to 0")
                case "road_travel_threshold":
                    if not value >= 0:
                        raise ValueError(f"{attr} must be greater than or equal to 0")
                case _:
                    if not MIN_TIME <= value <= MAX_TIME:
                        raise ValueError(f"{attr} must be between {MIN_TIME} and {MAX_TIME}")
    
    @property
    def abs_earliest_start(self) -> int:
        return self.earliest_acceptable_start - self.allowed_end_flexibility

    @property
    def abs_latest_end(self) -> int:
        return self.latest_acceptable_end + self.allowed_end_flexibility

    def encode(self):
        return self.__dict__
