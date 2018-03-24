# Allow imports from parent directory.
import os, sys, inspect
current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Imports.
import unittest
from test import Test
import rpy2.robjects as robjects
from rpy2.robjects.vectors import DataFrame
from rpy2.robjects.packages import importr

# Tests the methods in the Test class. Extends unittest.TestCase.
class TestTestMethods(unittest.TestCase):

    # Sets up a test.
    def setUp(self):
        self.test = Test(None, None)
        # Read the data from the test data directory.
        #exam_data = DataFrame.from_csvfile('test_data/raw_exam.csv')
        exam_data = DataFrame.from_csvfile('test_data/test.csv')
        # Run ltm on the response matrix.
        self.test.calculate_question_stats(exam_data)
        self.test.calculate_student_stats(exam_data)

    # Tests that discriminations are calculated correctly with ltm.
    def test_ltm_discrimination(self):
        # Check the first six questions' discriminations are equal to the pre-calculated ones.
        #self.assertAlmostEqual(self.test.get_discrimination(0), 0.4, places = 1)
        #self.assertAlmostEqual(self.test.get_discrimination(1), 1.45, places = 1)
        #self.assertAlmostEqual(self.test.get_discrimination(2), 0.33, places = 1)
        #self.assertAlmostEqual(self.test.get_discrimination(3), 0.46, places = 1)
        #self.assertAlmostEqual(self.test.get_discrimination(4), 1.06, places = 1)
        #self.assertAlmostEqual(self.test.get_discrimination(5), 0.48, places = 1)

    # Tests that item weights are calculated correctly with ltm.
    def test_item_weight(self):
        # Check the first six questions' item weights are equal to the pre-calculated ones.
        #self.assertAlmostEqual(self.test.get_item_weight(0), 2.57, places = 1)
        #self.assertAlmostEqual(self.test.get_item_weight(1), -1.61, places = 1)
        #self.assertAlmostEqual(self.test.get_item_weight(2), 0.38, places = 1)
        #self.assertAlmostEqual(self.test.get_item_weight(3), -0.93, places = 1)
        #self.assertAlmostEqual(self.test.get_item_weight(4), -1.85, places = 1)
        #self.assertAlmostEqual(self.test.get_item_weight(5), 0.8, places = 1)

    def test_locations(self):
        print self.test.locations
        # Check the first six students' locations are equal to the pre-calculated ones.
        self.assertAlmostEqual(self.test.get_location(0), -2.278, places = 1)
        self.assertAlmostEqual(self.test.get_location(1), -0.812, places = 1)
        self.assertAlmostEqual(self.test.get_location(2), -1.646, places = 1)
        self.assertAlmostEqual(self.test.get_location(3), -1.813, places = 1)
        self.assertAlmostEqual(self.test.get_location(4), -0.835, places = 1)
        self.assertAlmostEqual(self.test.get_location(5), -1.463, places = 1)
        self.assertAlmostEqual(self.test.get_location(5), -2, places = 1)

if __name__ == '__main__':
    unittest.main()