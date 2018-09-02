from ltm_extended_test import LtmTest

# Allow imports from parent directory.
import os, sys, inspect
current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Imports.
import unittest
from test import Test
import file_processing
import rpy2.robjects as robjects
from rpy2.robjects.vectors import DataFrame
from rpy2.robjects.packages import importr


EXAM_DATA = 'test_data/raw_exam.csv'

# Tests the methods in the Test class. Extends unittest.TestCase.
class TestTestMethods(unittest.TestCase):

    # Sets up a test.
    def setUp(self):
        # Read the data from the test data directory.
        content = ''
        with open(EXAM_DATA) as file_handle:
            content = file_handle.read()
        students = file_processing.to_student_array(content, prescored = True)

        # Create the test.
        self.test = LtmTest(students, None)
        
        # Run ltm on the response matrix.
        self.test.calculate_question_stats(store = False)
        self.test.calculate_student_stats(store = False)

    # Tests that discriminations are calculated correctly with ltm.
    def test_ltm_discrimination(self):
        # Check the first six questions' discriminations are equal to the pre-calculated ones.
        self.assertAlmostEqual(self.test.questions[0].get_discrimination(), 0.4, delta = 0.02)
        self.assertAlmostEqual(self.test.questions[1].get_discrimination(), 1.45, delta = 0.02)
        self.assertAlmostEqual(self.test.questions[2].get_discrimination(), 0.33, delta = 0.02)
        self.assertAlmostEqual(self.test.questions[3].get_discrimination(), 0.46, delta = 0.02)
        self.assertAlmostEqual(self.test.questions[4].get_discrimination(), 1.06, delta = 0.02)
        self.assertAlmostEqual(self.test.questions[5].get_discrimination(), 0.48, delta = 0.02)

    # Tests that item weights are calculated correctly with ltm.
    def test_item_weight(self):
        # Check the first six questions' item weights are equal to the pre-calculated ones.
        self.assertAlmostEqual(self.test.questions[0].get_item_weight(), 2.57, delta = 0.02)
        self.assertAlmostEqual(self.test.questions[1].get_item_weight(), -1.61, delta = 0.02)
        self.assertAlmostEqual(self.test.questions[2].get_item_weight(), 0.38, delta = 0.02)
        self.assertAlmostEqual(self.test.questions[3].get_item_weight(), -0.93, delta = 0.02)
        self.assertAlmostEqual(self.test.questions[4].get_item_weight(), -1.85, delta = 0.02)
        self.assertAlmostEqual(self.test.questions[5].get_item_weight(), 0.8, delta = 0.02)

    # Tests that students' locations are calculated correctly with ltm.
    def test_locations(self):
        # Check the first six students' locations are equal to the pre-calculated ones.
        self.assertAlmostEqual(self.test.students[0].get_location(), -0.08, delta = 0.02)
        self.assertAlmostEqual(self.test.students[1].get_location(), 0.31, delta = 0.02)
        self.assertAlmostEqual(self.test.students[2].get_location(), -0.29, delta = 0.02)
        self.assertAlmostEqual(self.test.students[3].get_location(), 0.56, delta = 0.02)
        self.assertAlmostEqual(self.test.students[4].get_location(), 0.87, delta = 0.02)
        self.assertAlmostEqual(self.test.students[5].get_location(), -0.46, delta = 0.02)

    # Tests that students' locations calculated with ltm are equal to those calculated with mirt.
    def test_mirt_ltm(self):
        pass

if __name__ == '__main__':
    unittest.main()