//
// Created by guillermo on 6/30/23.
//
#include <string>

#include <optimization_engine/optimize.hpp>

#include <ortools/lp_data/mps_reader.h>
#include <ortools/linear_solver/linear_solver.h>


using namespace operations_research;
using namespace google;


namespace optimization_engine {

  MPSolver* OptimizeMPSData(std::string& mps_data) {

    MPSolver* solver = MPSolver::CreateSolver("SCIP");

    auto model_proto = glop::MpsDataToMPModelProto(mps_data);

    std::string error_message = "an error message";
    MPSolverResponseStatus solver_response = solver->LoadModelFromProtoWithUniqueNamesOrDie(
      *model_proto,
      &error_message
    );

    if (solver_response != MPSOLVER_MODEL_IS_VALID) {
      return solver;
    }

    auto _ = solver->Solve();
    return solver;
  }

}
