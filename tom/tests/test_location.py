import unittest
from typing import List
from numpy import nan, NAN, NaN
from ..objs.location import Location


class TestLocation(unittest.TestCase):

    def setUp(self):
        self.test_location: Location = Location('Anywhere', 0.0, 0.0)
        self.nan_types: List[float] = [nan, NAN, NaN]

    def tearDown(self):
        del self.test_location

    def __attempt_name_setter(self, var) -> str:
        self.test_location.name = var
        return self.test_location.name

    def __attempt_lat_setter(self, var) -> float:
        self.test_location.lat = var
        return self.test_location.lat

    def __attempt_lon_setter(self, var) -> float:
        self.test_location.lon = var
        return self.test_location.lon

    def test_name(self):
        self.assertRaises(TypeError, self.__attempt_name_setter, 25)
        self.assertRaises(TypeError, self.__attempt_name_setter, 1.0)
        self.assertRaises(TypeError, self.__attempt_name_setter, ['Somewhere'])
        self.assertRaises(TypeError, self.__attempt_name_setter, {'Somewhere': 10})
        self.assertEqual(self.__attempt_name_setter('Somewhere'), 'Somewhere')
        self.setUp()

    def test_latitude(self):
        self.assertRaises(TypeError, self.__attempt_lat_setter, 10)
        self.assertRaises(TypeError, self.__attempt_lat_setter, 'Ten')
        self.assertRaises(TypeError, self.__attempt_lat_setter, ['Ten'])
        self.assertRaises(TypeError, self.__attempt_lat_setter, {'Ten': 10})
        for nan_type in self.nan_types:
            self.assertRaises(ValueError, self.__attempt_lat_setter, nan_type)
        self.assertEqual(self.__attempt_lat_setter(10.0), 10.0)
        self.setUp()

    def test_longitude(self):
        self.assertRaises(TypeError, self.__attempt_lon_setter, 10)
        self.assertRaises(TypeError, self.__attempt_lon_setter, 'Ten')
        self.assertRaises(TypeError, self.__attempt_lon_setter, ['Ten'])
        self.assertRaises(TypeError, self.__attempt_lon_setter, {'Ten': 10})
        for nan_type in self.nan_types:
            self.assertRaises(ValueError, self.__attempt_lon_setter, nan_type)
        self.assertEqual(self.__attempt_lon_setter(10.0), 10.0)
        self.setUp()


if __name__ == '__main__':
    unittest.main()
