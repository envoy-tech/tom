#pragma once

#include <string>
#include <unordered_map>
#include <vector>

#include <ortools/linear_solver/linear_solver.h>
#include <ortools/linear_solver/linear_solver_callback.h>

#include <optimization-engine/utils.hpp>

using namespace operations-research;
using namespace optimization_engine::utils;

namespace optimization_engine::solution {

  DoubleArray GetVariableSolution(std::string var_name, MPSolver* solver);

  class OptimizedSolution {

  // TODO: Determine better way to sync this with defined variables in tom-common
  protected:
    DoubleArray GO;
    DoubleArray FROM;
    DoubleArray STAY;
    DoubleArray TIME;
    DoubleArray INTER_DEPART_DAY;
    DoubleArray INTER_DEPART_HOUR;
    DoubleArray DEPART_DAY;
    DoubleArray DEPART_HOUR;
    DoubleArray ARRIVE_DAY;
    DoubleArray ARRIVE_HOUR;
    DoubleArray R_DEV;
    DoubleArray S_DEV;
    DoubleArray I_DEV;
    DoubleArray MEAN_R;
    DoubleArray INTER_R;
    DoubleArray SUM_R;

    public:
      OptimizedSolution(MPSolver* solver);
      ~OptimizedSolution() {}

      std::string GenerateJSONItinerary();

  };

}
