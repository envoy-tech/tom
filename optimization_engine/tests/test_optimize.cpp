//
// Created by guillermo on 6/30/23.
//
#include <string>
#include <fstream>

#include <optimization_engine/optimize.hpp>

#include <ortools/linear_solver/linear_solver.h>
#include <catch2/catch_test_macros.hpp>

using namespace operations_research;
using namespace optimization_engine;


TEST_CASE("Test OptimizeMPSData", "[test_optimize.cpp]") {

  std::ifstream mps_file("subtour_trip.mps");
  std::string mps_data;
  mps_file >> mps_data;

  MPSolver* solver = OptimizeMPSData(mps_data);
  // Call solver->Solve() again to get status. I don't think this re-runs whole thing?
  MPSolver::ResultStatus status = solver->Solve();

  REQUIRE(status == MPSolver::ResultStatus::OPTIMAL);
}
