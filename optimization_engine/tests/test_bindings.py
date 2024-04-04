import optimization_engine
from optimization_engine import *


def test_optimization_binding(small_trip_linear_mps):
    mps_file, _ = small_trip_linear_mps
    solver = OptimizeMPSData(mps_file)

    assert isinstance(solver, optimization_engine.MPSolver)
    assert isinstance(solver.variables()[0], optimization_engine.MPVariable)
