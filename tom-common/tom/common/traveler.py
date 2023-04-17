from dataclasses import dataclass


@dataclass
class Traveler:
    """Container for traveler's trip preferences."""

    _id: str
    username: str
    email: str
    location_ratings: list[int]
    desired_time_in_location: list[int]
    road_travel_threshold: int
    earliest_acceptable_start: int
    latest_acceptable_end: int
    allowed_start_flexibility: int
    allowed_end_flexibility: int
    active_stay_start: float
    active_stay_end: float

    @property
    def id(self) -> str:
        return self._id
    
    @property
    def abs_earliest_start(self) -> int:
        return self.earliest_acceptable_start - self.allowed_end_flexibility

    @property
    def abs_latest_end(self) -> int:
        return self.latest_acceptable_end + self.allowed_end_flexibility
