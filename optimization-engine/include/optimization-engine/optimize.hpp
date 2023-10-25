#pragma once

#include <string>

#include <ortools/linear_solver/linear_solver.h>
#include <optimization-engine/utils.hpp>

using namespace operations_research;
using namespace optimization_engine::utils;

namespace optimization_engine {

  SolutionContainer OptimizeMPSFile(std::string& file_name);

}
