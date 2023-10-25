//
// Created by guillermo on 6/30/23.
//
#include <string>

#include <pybind11/pybind11.h>
#include <optimization-engine/optimize.hpp>
#include <optimization-engine/utils.hpp>

#include <ortools/lp_data/mps_reader.h>
#include <ortools/linear_solver/linear_solver.h>


using namespace operations_research;
using namespace optimization_engine::utils;
using namespace google;

namespace py = pybind11;

namespace optimization_engine {

  SolutionContainer OptimizeMPSFile(std::string& file_name) {

    SolverContainer sc;
    sc.solver = MPSolver::CreateSolver("SCIP");

    SolutionContainer solution_container;

    auto model_proto = glop::MpsFileToMPModelProto(file_name);

    std::string error_message = "an error message";
    MPSolverResponseStatus solver_response = sc.solver->LoadModelFromProtoWithUniqueNamesOrDie(
      *model_proto,
      &error_message
    );

    if (solver_response != MPSOLVER_MODEL_IS_VALID) {
      solution_container.status = MPSolver::ResultStatus::MODEL_INVALID;
      return solution_container;
    }

    GetNumLocationsAndTravelers(&sc);
    GetFROMArray(&sc);

    SolutionCallback solution_cb = SolutionCallback(&sc);
    sc.solver->SetCallback(&solution_cb);

    MPSolver::ResultStatus result_status = sc.solver->Solve();

    solution_container.status = result_status;
    solution_container.solutions = WriteMPSolutionResponseToJSONString(&sc);

    return solution_container;
  }

}

PYBIND11_MODULE(optimization_engine, m) {
  m.doc() = "Optimization Engine Module";
  py::class_<SolutionContainer>(m, "SolutionContainer")
    .def(py::init<>())
    .def_readwrite("status", &SolutionContainer::status)
    .def_readwrite("solutions", &SolutionContainer::solutions);
  m.def("OptimizeMPSFile", &optimization_engine::OptimizeMPSFile, "Optimize an MPS file");
}



