import optimization_engine
import optimization_engine as oe

def test_optimization_binding():

    mps_file = "test.mps"
    with open(mps_file, "r") as f:
        mps_data = f.read()

    solver = oe.OptimizeMPSData(mps_data)

    assert isinstance(solver, optimization_engine.MPSolver)
    assert isinstance(solver.variables()[0], optimization_engine.MPVariable)
