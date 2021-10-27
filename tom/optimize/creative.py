import pandas as pd
import gurobipy as gp
import numpy as np
from itertools import permutations
import datetime as dt

# Setting random seed for reproduction
np.random.seed(5021996)

# INDICES #
inter = pd.read_csv("path")
locations = list(inter.columns)
n = len(locations)
start_location = 0
end_location = 0

# Time Information
start_date = dt.datetime(2021, 5, 2)
end_date = dt.datetime(2021, 5, 23)
duration_dt = end_date - start_date
num_days = duration_dt.days
days = range(num_days)
max_duration = duration_dt.total_seconds() / 60**2

# Absolute hours (20 -> 8pm)
earliest_start = (7 + 7 + 7.5 + 7) / 4
latest_end = 22

# 5 toy travelers
travelers = ['Nicole', 'Kyle', 'Soula', 'Guillo']
m = len(travelers)

# Each traveler rates each location from 0-10
ratings = pd.read_csv("path")
R = ratings.to_numpy()

# Each traveler decides how many hours they want
# to spend in each location 12-48
stay = pd.read_csv("path")
S = stay.to_numpy()
# Not including Washington DC
min_stay = np.min(S[:, 1:])

# Each traveler has a maximum time they're willing
# to spend travelling between locations
travel_thresh = [12, 12, 12, 12]
abs_thresh = max(travel_thresh) + 4

# Each location is some time distance from the others
I = inter.to_numpy()

# A very large number
big_n = 10000

# DERIVED VARIABLES
# Traveler's mean rating
mean_r = np.mean(R, axis=1)

# INITIALIZE MODEL
tom = gp.Model('Travel Optimization Model')

# ATOMIC DECISION VARS
GO = tom.addVars(n, vtype=gp.GRB.BINARY, name='GO')
FROM = tom.addVars(n, n, vtype=gp.GRB.BINARY, name='FROM')
R_DEV_Pos = tom.addVars(m, vtype=gp.GRB.CONTINUOUS, name='R_DEV_Pos')
R_DEV_Neg = tom.addVars(m, vtype=gp.GRB.CONTINUOUS, name='R_DEV_Neg')
R_DEV_IS_Pos = tom.addVars(m, vtype=gp.GRB.BINARY, name='R_DEV_IS_Pos')
R_DEV_IS_Neg = tom.addVars(m, vtype=gp.GRB.BINARY, name='R_DEV_IS_Neg')
S_DEV_Pos = tom.addVars(m, n, vtype=gp.GRB.CONTINUOUS, name='S_DEV_Pos')
S_DEV_Neg = tom.addVars(m, n, vtype=gp.GRB.CONTINUOUS, name='S_DEV_Neg')
S_DEV_IS_Pos = tom.addVars(m, n, vtype=gp.GRB.BINARY, name='S_DEV_IS_Pos')
S_DEV_IS_Neg = tom.addVars(m, n, vtype=gp.GRB.BINARY, name='S_DEV_IS_Neg')
I_DEV_Pos = tom.addVars(m, vtype=gp.GRB.CONTINUOUS, name='I_DEV_Pos')
I_DEV_Neg = tom.addVars(m, vtype=gp.GRB.CONTINUOUS, name='I_DEV_Neg')
I_DEV_IS_Pos = tom.addVars(m, vtype=gp.GRB.BINARY, name='I_DEV_IS_Pos')
I_DEV_IS_Neg = tom.addVars(m, vtype=gp.GRB.BINARY, name='I_DEV_IS_Neg')

DEPART_DAY = tom.addVars(n, vtype=gp.GRB.INTEGER, name='DEPART_DAY')
DEPART_HOUR = tom.addVars(n, vtype=gp.GRB.CONTINUOUS, name='DEPART_HOUR')

ARRIVE_DAY = tom.addVars(n, ub=num_days, vtype=gp.GRB.INTEGER, name='ARRIVE_DAY')
ARRIVE_HOUR = tom.addVars(n, vtype=gp.GRB.CONTINUOUS, name='ARRIVE_HOUR')

tom.update()

# DERIVED DECISION VARS
STAY = tom.addVars(n, vtype=gp.GRB.CONTINUOUS, name='STAY')
DURATION = tom.addVar(vtype=gp.GRB.CONTINUOUS, name='DURATION')
NUM_STOPS = tom.addVar(vtype=gp.GRB.INTEGER, name='NUM_STOPS')
NUM_TRANSITS = tom.addVar(vtype=gp.GRB.INTEGER, name='NUM_TRANSITS')
MEAN_R = tom.addVars(m, vtype=gp.GRB.CONTINUOUS, name='MEAN_R')
MEAN_I = tom.addVar(vtype=gp.GRB.CONTINUOUS, name='MEAN_I')
tom.update()

# INTERMEDIARY VARS
INTER_R = tom.addVars(m, vtype=gp.GRB.CONTINUOUS, name='INTER_R')
INTER_I = tom.addVar(vtype=gp.GRB.CONTINUOUS, name='INTER_I')

# CONSTRAINTS
tom.addConstr(GO.sum() == NUM_STOPS)
tom.addConstr(FROM.sum() == NUM_TRANSITS)
if start_location != end_location:
    tom.addConstr(NUM_TRANSITS == NUM_STOPS - 1)

for t in range(m):
    tom.addConstr(MEAN_R[t] * NUM_STOPS == INTER_R[t])
    tom.addConstr(sum(R[t, l] * GO[t] for l in range(n)) == INTER_R[t])

tom.addConstr(MEAN_I * NUM_TRANSITS == INTER_I)

for l1 in range(n):
    for l2 in range(n):
        tom.addConstr(I[l1, l2] * FROM[l1, l2] <= abs_thresh)

tom.addConstr(sum(sum(I[l1, l2] * FROM[l1, l2] for l2 in range(n)) for l1 in range(n)) == INTER_I)
tom.addConstr(STAY.sum() + sum(sum(FROM[l1, l2] * I[l1, l2] for l2 in range(n)) for l1 in range(n)) == DURATION)

tom.addConstr(STAY[start_location] == 0)
tom.addConstr(DEPART_DAY[start_location] == 0)
tom.addConstr(ARRIVE_DAY[start_location] == 0)
tom.addConstr(DEPART_HOUR[start_location] == earliest_start)
tom.addConstr(ARRIVE_HOUR[start_location] == earliest_start)
for l in range(n):
    if l == start_location:
        continue
    tom.addConstr(STAY[l] <= big_n * GO[l])
    tom.addConstr(min_stay * GO[l] <= STAY[l])

for l in range(n):
    tom.addConstr(DEPART_DAY[l] <= num_days * GO[l])
    tom.addConstr(DEPART_HOUR[l] <= latest_end * GO[l])
    tom.addConstr(DEPART_HOUR[l] >= earliest_start * GO[l])
    tom.addConstr(ARRIVE_DAY[l] <= num_days * GO[l])
    tom.addConstr(ARRIVE_HOUR[l] <= latest_end * GO[l])

for l2 in range(n):
    if l2 == start_location:
        continue
    tom.addConstr(ARRIVE_DAY[l2] == sum(FROM[l1, l2]*DEPART_DAY[l1] for l1 in range(n)))
    tom.addConstr(ARRIVE_HOUR[l2] == sum(FROM[l1, l2]*DEPART_HOUR[l1] + FROM[l1, l2]*I[l1, l2] for l1 in range(n)))

for l in range(n):
    if l == start_location:
        continue
    tom.addConstr(STAY[l] == (23*DEPART_DAY[l] + DEPART_HOUR[l]) - (23*ARRIVE_DAY[l] + ARRIVE_HOUR[l]))

tom.addConstr(DURATION <= max_duration)

for t in range(m):
    tom.addConstr(R_DEV_Pos[t] <= big_n * R_DEV_IS_Pos[t])
    tom.addConstr(R_DEV_Neg[t] <= big_n * R_DEV_IS_Neg[t])
    tom.addConstr(R_DEV_IS_Pos[t] + R_DEV_IS_Neg[t] <= 1)
    tom.addConstr(MEAN_R[t] - R_DEV_Pos[t] + R_DEV_IS_Neg[t] == mean_r[t])

for t in range(m):
    for l in range(n):
        tom.addConstr(S_DEV_Pos[t, l] <= big_n * S_DEV_IS_Pos[t, l])
        tom.addConstr(S_DEV_Neg[t, l] <= big_n * S_DEV_IS_Neg[t, l])
        tom.addConstr(S_DEV_IS_Pos[t, l] + S_DEV_IS_Neg[t, l] <= 1)
        tom.addConstr(STAY[l] - S_DEV_Pos[t, l] + S_DEV_Neg[t, l] == S[t, l])

for t in range(m):
    tom.addConstr(I_DEV_Pos[t] <= big_n * I_DEV_IS_Pos[t])
    tom.addConstr(I_DEV_Neg[t] <= big_n * I_DEV_IS_Neg[t])
    tom.addConstr(I_DEV_IS_Pos[t] + I_DEV_IS_Neg[t] <= 1)

for t in range(m):
    tom.addConstr(MEAN_I - I_DEV_Pos[t] + I_DEV_Neg[t] == travel_thresh[t])

for l in range(n):
    if (l == start_location) and (l != end_location):
        tom.addConstr(sum(FROM.select('*', l)) == 0)
        tom.addConstr(sum(FROM.select(l, '*')) == GO[l])
    elif (l != start_location) and (l == end_location):
        tom.addConstr(sum(FROM.select(l, '*')) == 0)
        tom.addConstr(sum(FROM.select('*', l)) == GO[l])
    else:
        tom.addConstr(sum(FROM.select(l, '*')) == GO[l])
        tom.addConstr(sum(FROM.select('*', l)) == GO[l])

tom.addConstr(GO[start_location] == 1)
tom.addConstr(GO[end_location] == 1)

tom._total_locations = n
tom._GO = GO
tom._FROM = FROM
tom._NUM_STOPS = NUM_STOPS
tom._NUM_TRANSITS = NUM_TRANSITS

tom.update()

tom.setObjective(sum(sum(S_DEV_Pos[t, l] + S_DEV_Neg[t, l] for l in range(n) if l != start_location) + R_DEV_Neg[t] + I_DEV_Pos[t] for t in range(m)),
                 gp.GRB.MINIMIZE)

tom.setParam('NonConvex', 2)
tom.setParam('LazyConstraints', 1)


def subtour_elim(model, where):

    if where == gp.GRB.Callback.MIPSOL:
        # make a list of edges selected in the solution
        vals = model.cbGetSolution(model._FROM)
        go = model.cbGetSolution(model._GO)
        stop_at = [i for i, val in go.items() if val]
        stops = model.cbGetSolution(model._NUM_STOPS)
        n = model._total_locations
        selected = gp.tuplelist()
        for i in range(n):
            for j in range(n):
                if vals[i, j]:
                    selected.append((i, j))
        # find the shortest cycle in the selected edge list
        tour = subtour(selected, stop_at)
        if len(tour) < stops:
            # add subtour elimination constr. for every pair of cities in tour
            if len(tour) == 2:
                i, j = tour
                model.cbLazy(model._FROM[i, j] + model._FROM[j, i] <= len(tour) - 1)
            else:
                model.cbLazy(sum(model._FROM[i, j] for i, j in permutations(tour, 2)) <= len(tour) - 1)


def subtour(edges, stop_at):
    unvisited = stop_at
    cycle = range(len(stop_at)+1)  # initial length has 1 more city
    while unvisited:  # true if list is non-empty
        thiscycle = []
        neighbors = unvisited
        while neighbors:
            current = neighbors[0]
            thiscycle.append(current)
            unvisited.remove(current)
            neighbors = [j for i, j in edges.select(current, '*') if j in unvisited]
        if len(cycle) > len(thiscycle):
            cycle = thiscycle
    return cycle


tom.optimize(subtour_elim)

trip_itineraries = {}
for possible_route in range(tom.getAttr('SolCount')):
    gp.setParam('SolutionNumber', possible_route)
    itinerary = {}
    curr = start_location
    stops_passed = 0
    while stops_passed != NUM_STOPS.Xn:
        if curr != start_location:
            itinerary[f'Arrive @ {locations[curr]} on:'] = f'Day {abs(ARRIVE_DAY[curr].Xn)} @ Hour {round(ARRIVE_HOUR[curr].Xn)}'
        itinerary[f'Stay in {locations[curr]} for:'] = f'{round(STAY[curr].Xn)} hours'
        itinerary[f'Depart {locations[curr]} on:'] = f'Day {abs(DEPART_DAY[curr].Xn)} @ Hour {round(DEPART_HOUR[curr].Xn)}'
        to = [round(i.Xn) for i in FROM.select(curr, '*')]
        next = to.index(1.0)
        curr = next
        stops_passed += 1
    trip_itineraries[f'Solution: {possible_route}'] = itinerary
