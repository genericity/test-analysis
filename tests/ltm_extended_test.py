# Allow imports from parent directory.
import os, sys, inspect
current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

import re
import db
from student import Student
from question import Question
import process_utils
import rpy2.robjects as robjects
from rpy2.robjects.packages import importr
from flask import session
from test import Test

# Represents an entire test. This overrides the current mIRT-using test to use the legacy, correct, but slower ltm library.
class LtmTest(Test):
	def __init__(self, students, versions, discarded = [], boundaries = None, texts = None, subboundaries = None, question_discriminations = None, question_weights = None,	student_locations = None):
		Test.__init__(self, students, versions, discarded, boundaries, texts, subboundaries, question_discriminations, question_weights, student_locations)

	# Sets item weights and discriminations for the questions.
	def calculate_question_stats(self, response_matrix = None, return_values = False, store = True):

		response_matrix = response_matrix or self.get_response_matrix()

		# Assign to a symbol.
		robjects.globalenv['response_matrix'] = response_matrix

		# Use ltm.
		importr('ltm')
		robjects.r('item_weights <- ltm(response_matrix ~ z1, na.action = NULL)')

		# Store a row of discrimination coefficients.
		discriminations = robjects.r('item_weights[1]$coefficients[,2]')
		# Store a row of item weights.
		item_weights = robjects.r('item_weights[1]$coefficients[,1] / item_weights[1]$coefficients[,2] * -1')

		# Store a row of discrimination coefficients.
		discriminations = robjects.r('item_weights[1]$coefficients[,2]')
		# Store a row of item weights.
		item_weights = robjects.r('item_weights[1]$coefficients[,1] / item_weights[1]$coefficients[,2] * -1')

		# Create a list to store the discriminations for saving into the database.
		discriminations_to_save = []
		# Create a list to store the weights for saving into the database.
		weights_to_save = []

		# Store inside the questions.
		for i in range(len(self.questions)):
			question = self.questions[i]

			# Cache the discrimination.
			# R vectors are 1-indexed.
			question.discrimination = discriminations.rx2(i + 1)[0]
			# Cache the item weight.
			# R vectors are 1-indexed.
			question.item_weight = item_weights.rx2(i + 1)[0]

			discriminations_to_save.append(question.discrimination)
			weights_to_save.append(question.item_weight)

		if store:
			# Set up a database object.
			database_manager = db.Database()

			database_manager.insert_or_update_from('question_discriminations', session['id'], discriminations_to_save)
			database_manager.insert_or_update_from('question_weights', session['id'], weights_to_save)

	# Sets locations for the students.
	def calculate_student_stats(self, response_matrix = None, return_values = False, store = True):
		response_matrix = response_matrix or self.get_response_matrix()

		# Assign to a symbol.
		robjects.globalenv['response_matrix'] = response_matrix

		# Use ltm.
		importr('ltm')
		robjects.r('item_scores <- ltm(response_matrix ~ z1, na.action = NULL)')
		robjects.r('locations <- factor.scores(item_scores, resp.patterns = response_matrix)')

		# Store a row of location coefficients.
		locations = robjects.r('locations$score.dat["z1"]')

		# Create a list to store the locations for saving into the database.
		locations_to_save = []

		# Store inside the questions.
		for i in range(len(self.students)):
			student = self.students[i]

			# Cache the discrimination.
			# R vectors are 1-indexed.
			student.location = locations.rx(i + 1, 'z1')[0]
			locations_to_save.append(student.location)

		if store:
			# Set up a database object.
			database_manager = db.Database()
			database_manager.insert_or_update_from('student_locations', session['id'], locations_to_save)

	# Returns the matrix of responses in a dataframe / ltm-usable format.
	def get_response_matrix(self):
		matrix = {}

		matrix_index = 0
		# For each question:
		for question_index in range(self.test_length):
			question = self.questions[question_index]

			# Cannot have questions where either 100% or 0% were correct, as ltm will crash.
			# This also excludes questions the user has opted to discard.
			if not question.discard:
				# Header value.
				question_response_vector = []

				# Retrieve all the responses for each student.
				for j in range(len(self.students)):
					question_response_vector.append(self.students[j].is_right(question_index))

				# question_response_vector.append(1)
				matrix_index += 1
			else:
				# Otherwise, create a vector of NA objects.
				question_response_vector = [robjects.NA_Logical] * len(self.students)

			# Convert to a vector.
			matrix[question_index + 1] = robjects.BoolVector(question_response_vector)

		# Convert the dictionary of vectors to a dataframe.
		response_matrix = robjects.DataFrame(matrix)

		return response_matrix
