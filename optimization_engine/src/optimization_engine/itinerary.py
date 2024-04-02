import datetime as dt

from tom.common import VARIABLE_REGISTRY


def create_itinerary(
        solver,
        num_locations: int,
        num_travelers: int,
        start_location_id: int,
        end_location_id: int,
        start_date: str
):
    is_linear = start_location_id != end_location_id
    buffed_num_locations = num_locations + is_linear

    class VarName:
        pass

    VARS = {}
    for var_name in VARIABLE_REGISTRY:
        if "DEV" in var_name:
            continue
        setattr(VarName, var_name, var_name)
        var = VARIABLE_REGISTRY[var_name](num_travelers, buffed_num_locations)
        start_idx = solver.LookupVariableOrNull(var.first_var_name).index()
        end_idx = var.end_idx(start_idx)
        var.data = [mpvar.solution_value() for mpvar in solver.variables()[start_idx:end_idx]]
        VARS[var_name] = var

    start_date_dttm = dt.datetime.fromisoformat(start_date)

    route = VARS[VarName.FROM].to_route(start_location_id, end_location_id)
    arrivals, departures = [], []
    for location_idx in route:
        arrive_day = VARS[VarName.ARRIVE_DAY].data[location_idx]
        arrive_hour = VARS[VarName.ARRIVE_HOUR].data[location_idx]
        arrivals.append(str(start_date_dttm + dt.timedelta(days=arrive_day, hours=arrive_hour)))

        depart_day = VARS[VarName.DEPART_DAY].data[location_idx]
        depart_hour = VARS[VarName.DEPART_HOUR].data[location_idx]
        departures.append(str(start_date_dttm + dt.timedelta(days=depart_day, hours=depart_hour)))

    itinerary = {
        "going_to_city": [bool(v) for v in VARS[VarName.GO].data[:num_locations]],
        "route": [int(r) for r in route],
        "num_stops": int(sum(VARS[VarName.GO].data[:num_locations])),
        "arrival_timestamp": arrivals,
        "departure_timestamp": departures,
        "stay_hours": [float(v) for v in VARS[VarName.STAY].data[:num_locations]],
        "trip_duration_hours": float(sum(VARS[VarName.TIME].data[:num_locations])),
    }

    return itinerary
