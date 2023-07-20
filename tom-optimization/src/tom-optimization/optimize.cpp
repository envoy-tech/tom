//
// Created by guillermo on 6/30/23.
//
#include <string>

#include <tom-optimization/optimize.hpp>
#include <tom-optimization/utils.hpp>

#include <ortools/lp_data/mps_reader.h>
#include <ortools/linear_solver/linear_solver.h>


using namespace operations_research;
using namespace tom_optimization::utils;
using namespace google;

namespace tom_optimization {

  MPSolver::ResultStatus OptimizeMPSFile(std::string& file_name) {

    SolverContainer sc;
    sc.solver = MPSolver::CreateSolver("SCIP");
    sc.solver->EnableOutput();

    auto model_proto = glop::MpsFileToMPModelProto(file_name);

    std::string error_message = "an error message";
    MPSolverResponseStatus solver_response = sc.solver->LoadModelFromProtoWithUniqueNamesOrDie(
      *model_proto,
      &error_message
    );

    if (solver_response != MPSOLVER_MODEL_IS_VALID) {
      return MPSolver::ResultStatus::MODEL_INVALID;
    }

    GetNumLocationsAndTravelers(&sc);

    bool had_subtours = true;
    MPSolver::ResultStatus result_status;

    while (had_subtours) {
      result_status = sc.solver->Solve();
      if (result_status != MPSolver::ResultStatus::OPTIMAL) {
        return result_status;
      }
      had_subtours = FindAndEliminateSubtours(&sc);
    }
    return result_status;
  }

}
