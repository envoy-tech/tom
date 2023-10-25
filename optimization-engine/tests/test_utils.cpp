//
// Created by guillermo on 6/26/23.
//
#include <filesystem>
#include <fstream>
#include <iostream>

#include <optimization-engine/utils.hpp>

#include <ortools/linear_solver/linear_solver.h>
#include <ortools/lp_data/mps_reader.h>
#include <google/protobuf/util/json_util.h>
#include <catch2/catch_test_macros.hpp>

using namespace operations_research;
using namespace optimization_engine::utils;
using namespace google;

SolverContainer LoadSolverWithSolution(
  const std::filesystem::path& model_file,
  const std::filesystem::path& solution_file
  ) {
  SolverContainer sc;
  sc.solver = MPSolver::CreateSolver("SCIP");

  auto model_proto = glop::MpsFileToMPModelProto(model_file);

  std::string error_message = "an error message";
  MPSolverResponseStatus _ = sc.solver->LoadModelFromProtoWithUniqueNamesOrDie(
  *model_proto,
  &error_message
  );

  std::ifstream fstream(solution_file);
  std::string solution_string;

  fstream >> solution_string;

  MPSolutionResponse response;
  protobuf::util::JsonStringToMessage(solution_string, &response);

  sc.solver->LoadSolutionFromProto(response);

  return sc;
}

TEST_CASE("Test TOM utility functions on small problem", "[test_utils.cpp]") {

  SECTION("Test Filling in SolverContainer") {

    const std::filesystem::path solution_file = "sample_MPSolutionResponse.json";
    const std::filesystem::path model_file = "test.mps";

    SolverContainer sc = LoadSolverWithSolution(model_file, solution_file);

    GetNumLocationsAndTravelers(&sc);
    REQUIRE(sc.num_locations == 9);
    REQUIRE(sc.num_travelers == 3);

    GetFROMArray(&sc);
    DoubleArray FROM_solution(sc.num_locations, std::vector<double>(sc.num_locations));
    for (int i = 0; i < sc.num_locations; i++) {
      for (int j = 0; j < sc.num_locations; j++) {
        FROM_solution[i][j] = sc.FROM[i][j]->solution_value();
      }
    }
    DoubleArray expected_solution = {
      {0, 0, 0, 0, 0, 0, 1, 0, 0},
      {1, 0, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 1, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 1, 0},
      {0, 0, 0, 1, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 1, 0, 0, 0, 0},
      {0, 0, 1, 0, 0, 0, 0, 0, 0},
      {0, 1, 0, 0, 0, 0, 0, 0, 0},
      {0, 0, 0, 0, 0, 0, 0, 0, 0}
    };

    REQUIRE(FROM_solution == expected_solution);

    FindAndEliminateSubtours(&sc, &FROM_solution);
  }

  SECTION("Test Filling in SolverContainer") {

    const std::filesystem::path solution_file = "sample_large_MPSolutionResponse.json";
    const std::filesystem::path model_file = "test_large.mps";

    SolverContainer sc = LoadSolverWithSolution(model_file, solution_file);

    GetNumLocationsAndTravelers(&sc);
    REQUIRE(sc.num_locations == 21);
    REQUIRE(sc.num_travelers == 4);

    GetFROMArray(&sc);
    DoubleArray FROM_solution(sc.num_locations, std::vector<double>(sc.num_locations));
    for (int i = 0; i < sc.num_locations; i++) {
      for (int j = 0; j < sc.num_locations; j++) {
        FROM_solution[i][j] = sc.FROM[i][j]->solution_value();
      }
    }
    DoubleArray expected_solution = {
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0},
    {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0},
    };

    REQUIRE(FROM_solution == expected_solution);

    FindAndEliminateSubtours(&sc, &FROM_solution);
  }


}
