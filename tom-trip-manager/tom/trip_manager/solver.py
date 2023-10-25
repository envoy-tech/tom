from typing import Union, Callable

import numpy as np
from ortools.linear_solver import pywraplp


class SolverName:
    SCIP = "SCIP"


class DeviationalVarSuffix:
    POS = "Pos"
    NEG = "Neg"
    IS_POS = "IS_Pos"
    IS_NEG = "IS_Neg"


def log_var_indices(func):

    def wrapper(*args, **kwargs):
        solver_inst = args[0]
        name = kwargs.get("name")
        result = func(*args, **kwargs)
        if isinstance(result, pywraplp.Variable):
            solver_inst.var_indices[name] = tuple(result.index())

        elif isinstance(result, np.ndarray):
            flat_arr: list[pywraplp.Variable] = result.flatten().tolist()
            solver_inst.var_indices[name] = (flat_arr[0].index(), flat_arr[-1].index())

        return result

    return wrapper


class TripSolver:

    def __init__(self):
        self.solver = pywraplp.Solver.CreateSolver(SolverName.SCIP)
        self.var_indices: dict[str, tuple[int, ...]] = {}

    @staticmethod
    def _variable_array(
            shape: Union[int, tuple[int, ...]],
            func: Callable,
            name_prefix: str,
            **kwargs
    ) -> np.ndarray:

        _arr = np.empty(shape, dtype=object)
        for idx in np.ndindex(shape):
            kwargs["name"] = f"{name_prefix}_[{idx}]"
            _arr[idx] = func(**kwargs)
        return _arr

    def NumVar(self, **kwargs) -> pywraplp.Variable:
        return self.solver.NumVar(**kwargs)

    def IntVar(self, **kwargs) -> pywraplp.Variable:
        return self.solver.IntVar(**kwargs)

    def BoolVar(self, **kwargs) -> pywraplp.Variable:
        return self.solver.BoolVar(**kwargs)

    def DeviationVar(
            self,
            lb: Union[int, float] = 0,
            ub: Union[int, float] = pywraplp.Solver.Infinity(),
            name: str = "",
            *,
            return_bools: bool = False
    ) -> tuple[pywraplp.Variable, ...]:
        
        pos_name = f"{name}_{DeviationalVarSuffix.POS}"
        neg_name = f"{name}_{DeviationalVarSuffix.NEG}"
        is_pos_name = f"{name}_{DeviationalVarSuffix.IS_POS}"
        is_neg_name = f"{name}_{DeviationalVarSuffix.IS_NEG}"

        pos = self.NumVar(lb=lb, ub=ub, name=pos_name)
        neg = self.NumVar(lb=lb, ub=ub, name=neg_name)
        is_pos = self.BoolVar(name=is_pos_name)
        is_neg = self.BoolVar(name=is_neg_name)

        self.AddConstraint(is_pos + is_neg <= 1, name=f"{name}_deviational_contstraint")
        self.AddConstraint(pos <= ub * is_pos, name=f"set_ceiling_for_{name}_pos")
        self.AddConstraint(neg <= ub * is_neg, name=f"set_ceiling_for_{name}_neg")

        out = [pos, neg]

        if return_bools:
            out.extend([is_pos, is_neg])
        
        return out

    @log_var_indices
    def NumArray(
            self,
            shape: Union[int, tuple[int, ...]],
            *,
            name: str = "",
            lb: Union[int, float] = 0,
            ub: Union[int, float] = pywraplp.Solver.Infinity()
    ):
        
        func = self.NumVar
        return self._variable_array(shape, func, name, lb=lb, ub=ub)

    @log_var_indices
    def IntArray(
            self,
            shape: Union[int, tuple[int, ...]],
            *,
            name: str = "",
            lb: Union[int, float] = 0.0,
            ub: Union[int, float] = pywraplp.Solver.Infinity()
    ):
        
        func = self.IntVar
        return self._variable_array(shape, func, name, lb=lb, ub=ub)

    @log_var_indices
    def BoolArray(
            self,
            shape: Union[int, tuple[int, ...]],
            *,
            name: str = ""
    ):
        
        func = self.BoolVar
        return self._variable_array(shape, func, name)

    @log_var_indices
    def DeviationArray(
        self,
        shape: Union[int, tuple[int, ...]],
        *,
        name: str = "",
        lb: Union[int, float] = 0,
        ub: Union[int, float] = pywraplp.Solver.Infinity(),
        return_bools: bool = False
    ) -> list[np.ndarray]:
        """Convenience function to create deviational variables for any model goals.

        Function automatically implements the basic constraints on all deviational variables, i.e.

        - is_neg + is_pos <= 1
        - pos <= ub * is_pos
        - neg <= ub * is_neg

        Other constraints on the variables can be added after the fact with the output of this function.

        :param shape: shape of the desired output variable arrays
        :param name: name prefix for all variables
        :param lb: lower bound of variables (default: 0)
        :param ub: upper bound of variables (default: inf)
        :param return_bools: flag to return the is_pos and is_neg boolean variables that constrain
                            the other deviational variables
        """
        pos_name = f"{name}_{DeviationalVarSuffix.POS}"
        neg_name = f"{name}_{DeviationalVarSuffix.NEG}"
        is_pos_name = f"{name}_{DeviationalVarSuffix.IS_POS}"
        is_neg_name = f"{name}_{DeviationalVarSuffix.IS_NEG}"
        
        pos = self.NumArray(shape, name=pos_name, lb=lb, ub=ub)
        neg = self.NumArray(shape, name=neg_name, lb=lb, ub=ub)
        is_pos = self.BoolArray(shape, name=is_pos_name)
        is_neg = self.BoolArray(shape, name=is_neg_name)
        
        self.ArrayConstraint(
            np.less_equal(is_pos + is_neg, 1, dtype=object),
            name_prefix=f"{name}_deviational_contstraint"
        )
        self.ArrayConstraint(
            np.less_equal(pos, ub * is_pos, dtype=object),
            name_prefix=f"set_ceiling_for_{name}_pos"
        )
        self.ArrayConstraint(
            np.less_equal(neg, ub * is_neg, dtype=object),
            name_prefix=f"set_ceiling_for_{name}_neg"
        )
        
        out = [pos, neg]
        
        if return_bools:
            out.extend([is_pos, is_neg])
        
        return out

    def AddConstraint(self, *args, **kwargs):
        self.solver.Add(*args, **kwargs)

    def ArrayConstraint(self, array_expr_result: np.ndarray, name_prefix: str):
        shape = array_expr_result.shape
        for idx in np.ndindex(shape):
            self.AddConstraint(array_expr_result[idx], name=f"{name_prefix}_[{idx}]")

    def Minimize(self, *args, **kwargs):
        self.solver.Minimize(*args, **kwargs)

    def ExportModelAsMpsFormat(self) -> str:
        return self.solver.ExportModelAsMpsFormat(True, False)
