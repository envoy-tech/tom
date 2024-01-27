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


TEST_CASE("Test OptimizeMPSData on circular trip", "[test_optimize.cpp]") {

  std::ifstream mps_file ("small_trip_circular.mps");
  std::stringstream buffer;
  buffer << mps_file.rdbuf();

  std::string mps_data = buffer.str();
  MPSolver* solver = OptimizeMPSData(mps_data);
  MPSolver::ResultStatus status = solver->Solve();

  std::vector<MPVariable*> variables = solver->variables();

  REQUIRE(status == MPSolver::ResultStatus::OPTIMAL);
}

TEST_CASE("Test OptimizeMPSData on sequential trip", "[test_optimize.cpp]") {

  std::ifstream mps_file ("small_trip_sequential.mps");
  std::stringstream buffer;
  buffer << mps_file.rdbuf();

  std::string mps_data = buffer.str();
  MPSolver* solver = OptimizeMPSData(mps_data);
  MPSolver::ResultStatus status = solver->Solve();

  std::vector<MPVariable*> variables = solver->variables();

  REQUIRE(status == MPSolver::ResultStatus::OPTIMAL);
}
