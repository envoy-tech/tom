import unittest
from ..objs.traveler import Traveler


class TestTraveler(unittest.TestCase):

    def setUp(self):
        self.test_traveler: Traveler = Traveler('Jane', 'test@yeet.org')

    def tearDown(self):
        del self.test_traveler

    def __reset_test_traveler(self):
        self.test_traveler = Traveler('Jane', 'test@yeet.org')

    def __attempt_name_setter(self, var) -> str:
        self.test_traveler.name = var
        return self.test_traveler.name

    def __attempt_email_setter(self, var) -> str:
        self.test_traveler.email = var
        return self.test_traveler.email

    def test_name(self):
        self.assertRaises(TypeError, self.__attempt_name_setter, 25)
        self.assertRaises(TypeError, self.__attempt_name_setter, 1.0)
        self.assertRaises(TypeError, self.__attempt_name_setter, ['George'])
        self.assertRaises(TypeError, self.__attempt_name_setter, {'George': 10})
        self.assertEqual(self.__attempt_name_setter('George'), 'George')
        self.__reset_test_traveler()

    def test_email(self):
        self.assertRaises(TypeError, self.__attempt_email_setter, 25)
        self.assertRaises(TypeError, self.__attempt_email_setter, 1.0)
        self.assertRaises(TypeError, self.__attempt_email_setter, ['test@yahoo.com'])
        self.assertRaises(TypeError, self.__attempt_email_setter, {'test@yoohoo.com': 10})
        self.assertEqual(self.__attempt_email_setter('test@yewho.io'), 'test@yewho.io')
        self.__reset_test_traveler()


if __name__ == '__main__':
    unittest.main()
