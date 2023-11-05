import optimization_engine
import optimization_engine as oe


def test_optimization_binding(sample_trip_mps):

    solver = oe.OptimizeMPSData(sample_trip_mps)

    assert isinstance(solver, optimization_engine.MPSolver)
    assert isinstance(solver.variables()[0], optimization_engine.MPVariable)
