//
// Created by guillermo on 10/30/23.
//
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include <optimization_engine/optimize.hpp>

namespace py = pybind11;

using namespace optimization_engine;


PYBIND11_MODULE(optimize_bind, m) {
  m.doc() = "Optimization Engine Module";
  py::enum_<MPSolver::ResultStatus>(m, "ResultStatus")
    .value("OPTIMAL", MPSolver::ResultStatus::OPTIMAL)
    .value("FEASIBLE", MPSolver::ResultStatus::FEASIBLE)
    .value("INFEASIBLE", MPSolver::ResultStatus::INFEASIBLE)
    .value("UNBOUNDED", MPSolver::ResultStatus::UNBOUNDED)
    .value("ABNORMAL", MPSolver::ResultStatus::ABNORMAL)
    .value("MODEL_INVALID", MPSolver::ResultStatus::MODEL_INVALID)
    .value("NOT_SOLVED", MPSolver::ResultStatus::NOT_SOLVED);
  py::class_<MPVariable>(m, "MPVariable")
    .def("index", &MPVariable::index)
    .def("solution_value", &MPVariable::solution_value);
  py::class_<MPSolver>(m, "MPSolver")
    .def("variables", &MPSolver::variables, py::return_value_policy::reference_internal)
    .def("NextSolution", &MPSolver::NextSolution)
    .def("LookupVariableOrNull", &MPSolver::LookupVariableOrNull, py::return_value_policy::reference_internal);
  m.def("OptimizeMPSData", &OptimizeMPSData, "Optimize data from an MPS file");
}
