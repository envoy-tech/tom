//
// Created by guillermo on 6/30/23.
//
#include <string>

#include <tom-optimization/optimize.hpp>

#include <ortools/linear_solver/linear_solver.h>
#include <catch2/catch_test_macros.hpp>

using namespace operations_research;
using namespace tom_optimization;


TEST_CASE("Test OptimizeMPSFile", "[test_optimize.cpp]") {

  std::string file_name = "test_large.mps";

  MPSolver::ResultStatus result_status = OptimizeMPSFile(file_name);

  REQUIRE(result_status == MPSolver::ResultStatus::OPTIMAL);
}
