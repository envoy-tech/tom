import datetime as dt

from tom.common import VARIABLE_REGISTRY


def create_itinerary(
        solver,
        num_locations: int,
        num_travelers: int,
        start_location_id: int,
        start_date: str
):

    class VarName:
        pass

    VARS = {}
    for var_name in VARIABLE_REGISTRY:
        if "DEV" in var_name:
            continue
        setattr(VarName, var_name, var_name)
        var = VARIABLE_REGISTRY[var_name](num_travelers, num_locations)
        start_idx = solver.LookupVariableOrNull(var.first_var_name).index()
        end_idx = var.end_idx(start_idx)
        var.data = [mpvar.solution_value() for mpvar in solver.variables()[start_idx:end_idx]]
        VARS[var_name] = var

    start_date_dttm = dt.datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")

    route = VARS[VarName.FROM].to_route(start_location_id)
    arrivals, departures = [], []
    for location_idx in route:
        arrive_day = VARS[VarName.ARRIVE_DAY].data[location_idx]
        arrive_hour = VARS[VarName.ARRIVE_HOUR].data[location_idx]
        arrivals.append(str(start_date_dttm + dt.timedelta(days=arrive_day, hours=arrive_hour)))

        depart_day = VARS[VarName.DEPART_DAY].data[location_idx]
        depart_hour = VARS[VarName.DEPART_HOUR].data[location_idx]
        departures.append(str(start_date_dttm + dt.timedelta(days=depart_day, hours=depart_hour)))

    itinerary = {
        "going_to_city": VARS[VarName.GO].data,
        "route": route,
        "num_stops": sum(VARS[VarName.GO].data),
        "arrival_timestamp": arrivals,
        "departure_timestamp": departures,
        "stay_hours": VARS[VarName.STAY].data,
        "trip_duration_hours": sum(VARS[VarName.TIME].data)
    }

    return itinerary
