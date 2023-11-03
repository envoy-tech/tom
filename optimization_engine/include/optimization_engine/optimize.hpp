#pragma once

#include <string>

#include <ortools/linear_solver/linear_solver.h>

using namespace operations_research;

namespace optimization_engine {

  MPSolver* OptimizeMPSData(std::string& mps_data);

}
