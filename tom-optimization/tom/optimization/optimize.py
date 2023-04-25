from pathlib import Path

from ortools.linear_solver.python import model_builder

import tom.optimization.common_utils as cu


class SolverName:
    SCIP = "SCIP"


def optimize_mps_file(filepath: Path):

    model = model_builder.ModelBuilder()
    model.import_from_mps_file(filepath)

    solver = model_builder.ModelSolver(SolverName.SCIP)
    solver.solve(model)

    had_subtours = True
    # Continue solution attempts until solution without subtours is found
    while had_subtours:
        solver.Solve()
        had_subtours = cu.find_and_eliminate_subtours(FROM, start_idx, solver)


