#pragma once

#include <string>
#include <unordered_map>
#include <vector>

#include <ortools/linear_solver/linear_solver.h>

using namespace operations_research;

namespace tom_optimization::utils {

  struct SolverContainer {
    MPSolver* solver;
    int num_travelers = 0;
    int num_locations = 0;
    std::vector<std::vector<MPVariable*>> FROM;
  };

  void WriteMPSolutionResponseToJSON(SolverContainer* sc, const std::string& filename);

  void GetNumLocationsAndTravelers(SolverContainer* sc);

  void GetFROMSolution(SolverContainer* sc);

  std::unordered_map<int, int> ParseDepartures(std::vector<std::vector<MPVariable*>>* departure_matrix);

  std::vector<std::vector<int>> FindSubtours(std::vector<std::vector<MPVariable*>>* departure_matrix);

  void EliminateSubtours(SolverContainer* sc, std::vector<std::vector<int>>* subtours);

  bool FindAndEliminateSubtours(SolverContainer* sc);

}
