//
// Created by guillermo on 6/30/23.
//
#include <string>

#include <optimization-engine/optimize.hpp>
#include <optimization-engine/utils.hpp>

#include <ortools/linear_solver/linear_solver.h>
#include <catch2/catch_test_macros.hpp>

using namespace operations_research;
using namespace optimization_engine;
using namespace optimization_engine::utils;


TEST_CASE("Test OptimizeMPSFile", "[test_optimize.cpp]") {

  std::string file_name = "test.mps";

  SolutionContainer solution_container = OptimizeMPSFile(file_name);

  REQUIRE(solution_container.status == MPSolver::ResultStatus::OPTIMAL);
}
