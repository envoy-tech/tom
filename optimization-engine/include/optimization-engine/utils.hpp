#pragma once

#include <string>
#include <unordered_map>
#include <vector>

#include <ortools/linear_solver/linear_solver.h>
#include <ortools/linear_solver/linear_solver_callback.h>


using namespace operations_research;

namespace optimization_engine::utils {

  typedef std::vector<std::vector<double>> DoubleArray;
  typedef std::vector<std::vector<MPVariable*>> MPVariableArray;

  struct SolverContainer {
    MPSolver* solver;
    int num_travelers = 0;
    int num_locations = 0;
    MPVariableArray FROM;
  };

  struct SolutionContainer {
    MPSolver::ResultStatus status;
    std::string solutions;
  };

  class SolutionCallback : public MPCallback
  {
  protected:
    const bool add_cuts = true;
    const bool add_lazy_constraints = true;
    SolverContainer* sc;

  public:
    SolutionCallback(SolverContainer* sc) : MPCallback(add_cuts, add_lazy_constraints) {
      sc = sc;
    }
    ~SolutionCallback() {}

    void RunCallback(MPCallbackContext* context) override;
  };

  std::string WriteMPSolutionResponseToJSONString(SolverContainer* sc);

  void GetNumLocationsAndTravelers(SolverContainer* sc);

  void GetFROMArray(SolverContainer* sc);

  std::unordered_map<int, int> ParseDepartures(MPVariableArray* departure_matrix);

  DoubleArray FindSubtours(MPVariableArray* departure_matrix);

  void EliminateSubtours(SolverContainer* sc, DoubleArray* subtours);

  void FindAndEliminateSubtours(SolverContainer* sc, DoubleArray* from_values);

}
