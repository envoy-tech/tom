//
// Created by guillermo on 6/26/23.
//

#include <unordered_map>
#include <vector>
#include <algorithm>
#include <fstream>

#include <optimization-engine/utils.hpp>
#include <ortools/linear_solver/linear_solver.h>
#include <ortools/linear_solver/linear_solver_callback.h>
#include <google/protobuf/util/json_util.h>


using namespace operations_research;
using namespace google;

namespace optimization_engine::utils {


  void SolutionCallback::RunCallback(MPCallbackContext* context) {
    if (context->Event() == MPCallbackEvent::kMipSolution) {
      GetFROMArray(sc);
      DoubleArray FROM_values(sc->num_locations, std::vector<double>(sc->num_locations));
      for (int i = 0; i < sc->num_locations; i++) {
        for (int j = 0; j < sc->num_locations; j++) {
          FROM_values[i][j] = context->VariableValue(sc->FROM[i][j]);
        }
      }
      FindAndEliminateSubtours(sc, &FROM_values);
    }
  }

  std::string WriteMPSolutionResponseToJSONString(SolverContainer* sc) {
    /// Writes the solution of a solver to a JSON string. Assumes that the solver
    /// being used in SCIP.
    MPModelProto model;
    sc->solver->ExportModelToProto(&model);

    MPModelRequest request;
    request.set_allocated_model(&model);
    request.set_solver_type(MPModelRequest::SCIP_MIXED_INTEGER_PROGRAMMING);
    request.set_populate_additional_solutions_up_to(15);

    MPSolutionResponse response;
    MPSolver::SolveWithProto(request, &response);

    std::string response_string;
    auto status = protobuf::util::MessageToJsonString(response, &response_string);

    return response_string;
  }

  void GetNumLocationsAndTravelers(SolverContainer* sc) {

    std::vector<MPVariable*> vars = sc->solver->variables();

    for (auto var : vars) {
      std::string var_name = (*var).name();
      if (var_name.substr(0, 2) == "GO") {
        sc->num_locations++;
      } else if (var_name.substr(0, 6) == "MEAN_R") {
        sc->num_travelers++;
      }
    }
  }

  void GetFROMArray(SolverContainer* sc) {
    // Re-initialize FROM array to be specific shape
    MPVariableArray FROM(sc->num_locations, std::vector<MPVariable*>(sc->num_locations));
    sc->FROM = FROM;

    for (int i = 0; i < sc->num_locations; i ++) {
      std::string row_idx = std::to_string(i);
      for (int j = 0; j < sc->num_locations; j++) {
        std::string col_idx = std::to_string(j);
        //TODO: Fix this variable name lookup. This is very fragile
        // since it is hardcoded here.
        std::string var_name = "FROM_[(" + row_idx + ",_" + col_idx + ")]";
        sc->FROM[i][j] = sc->solver->LookupVariableOrNull(var_name);
      }
    }
  }

  std::unordered_map<int, int> ParseDepartures(DoubleArray* departure_matrix) {

    std::unordered_map<int, int> departures;
    auto m = departure_matrix->size();
    auto n = departure_matrix[0].size();

    for (int i=0; i < m; i++) {
      for (int j=0; j < n; j++) {
        if ((*departure_matrix)[i][j] != 0.0) {
          departures[i] = j;
        }
      }
    }
  return departures;
  }

  DoubleArray FindSubtours(DoubleArray* departure_matrix) {

    auto departures = ParseDepartures(departure_matrix);

    std::vector<int> unvisited;
    int row_idx = 0;
    for (const std::vector<double>& row : (*departure_matrix)) {
      double row_sum = 0;
      for (int var : row) {
        row_sum += var;
      }
      if (row_sum == 1) {
        unvisited.push_back(row_idx);
      }
      row_idx++;
    }

    auto continuous_trip_size = unvisited.size();
    DoubleArray subtours;
    // Default assumption is that start location has index 0
    int curr_location = 0;
    while (not unvisited.empty()) {
      std::vector<double> subtour;
      bool has_unvisited_destination = true;
      while (has_unvisited_destination) {
        subtour.push_back(curr_location);
        auto curr_loc_iter = std::find(unvisited.begin(), unvisited.end(), curr_location);
        unvisited.erase(curr_loc_iter);
        int next_location = departures[curr_location];
        auto unvisited_dest_iter = std::find(unvisited.begin(), unvisited.end(), next_location);
        if (unvisited_dest_iter == unvisited.end()) {
          has_unvisited_destination = false;
        }
        curr_location = next_location;
      }

      if (subtour.size() < continuous_trip_size) {
        subtours.push_back(subtour);
      }
    }
    return subtours;
  }

  void EliminateSubtours(SolverContainer* sc, DoubleArray* subtours) {
    const double inf = sc->solver->infinity();
    for (std::vector<double> subtour : (*subtours)) {
      std::string subtour_string(subtour.begin(), subtour.end());
      std::string constraint_name = "Eliminate subtour for cities " + subtour_string;
      MPConstraint* const c0 = sc->solver->MakeRowConstraint(-inf, 1.0, constraint_name);
      if (subtour.size() == 2) {
        int i = subtour[0], j = subtour[1];
        c0->SetCoefficient(sc->FROM[i][j], 1);
        c0->SetCoefficient(sc->FROM[j][i], 1);
      } else {
        // Permute all possible combinations of this subtour and eliminate them
        for (int i = 0; i < sc->num_locations; i++) {
          for (int j = 0; j < sc->num_locations; j++) {
            if (i != j) {
              c0->SetCoefficient(sc->FROM[i][j], 1);
            }
          }
        }
      }
    }
  }

  void FindAndEliminateSubtours(SolverContainer* sc, DoubleArray* from_values) {

    DoubleArray subtours = FindSubtours(from_values);
    if (not subtours.empty()) {
      EliminateSubtours(sc, &subtours);
    }
  }
}
