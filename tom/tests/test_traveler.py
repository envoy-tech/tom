import unittest
from tom.objs.traveler import Traveler, LeadTraveler


class TestTraveler(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        super(TestTraveler, self).__init__(*args, **kwargs)
        self.test_traveler: Traveler = Traveler('Jane', 'test@yeet.org')

    def __reset_test_traveler(self):
        self.test_traveler = Traveler('Jane', 'test@yeet.org')

    def __attempt_name_setter(self, var) -> str:
        self.test_traveler.name = var
        return self.test_traveler.name

    def __attempt_email_setter(self, var) -> str:
        self.test_traveler.email = var
        return self.test_traveler.email

    def test_name(self):
        self.assertRaises(AttributeError, self.__attempt_name_setter, 25)
        self.assertRaises(AttributeError, self.__attempt_name_setter, 1.0)
        self.assertRaises(AttributeError, self.__attempt_name_setter, ['George'])
        self.assertRaises(AttributeError, self.__attempt_name_setter, {'George': 10})
        self.assertEqual(self.__attempt_name_setter('George'), 'George')
        self.__reset_test_traveler()

    def test_email(self):
        self.assertRaises(AttributeError, self.__attempt_email_setter, 25)
        self.assertRaises(AttributeError, self.__attempt_email_setter, 1.0)
        self.assertRaises(AttributeError, self.__attempt_email_setter, ['test@yahoo.com'])
        self.assertRaises(AttributeError, self.__attempt_email_setter, {'test@yoohoo.com': 10})
        self.assertEqual(self.__attempt_email_setter('test@yewho.io'), 'test@yewho.io')
        self.__reset_test_traveler()


if __name__ == '__main__':
    unittest.main()
