#pragma once

#include <string>

#include <ortools/linear_solver/linear_solver.h>

using namespace operations_research;

namespace tom_optimization {

  MPSolver::ResultStatus OptimizeMPSFile(std::string& file_name);

}
