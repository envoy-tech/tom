
from tom.optimization.optimize import optimize_mps_file


def test_mps_file_read(mps_test_file):

    out = optimize_mps_file(mps_test_file)

    assert True
