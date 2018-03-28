import process_utils

# Constants.
TEST_LENGTH = 30

# Class representing a single student.
class Student:
	# Initialize and retrieve student data from the data string.
	# @param data {string} The student data.
	def __init__(self, data, prescored):
		# {string} ID number.
		self.id = 'ID not given'
		# {string} Last name.
		self.last_name = 'Last name'
		# {string} First name.
		self.first_name = 'First name'
		# {string} Version of the test.
		self.version = None
		# {!Array<boolean>} Whether each question was right or not.
		self.scores = []
		# {!Array<number>} The raw answers given by the student.
		self.answers = None

		if prescored:
			self.init_prescored(data)
		else:
			self.init_non_prescored(data)

	def init_non_prescored(self, data):
		# ID number.
		self.id = data[2:11].strip()
		# Last name.
		self.last_name = data[12:25].strip()
		# First name.
		self.first_name = data[25:33].strip()
		# Version of the test.
		self.version = data[33:44].strip()

		# Split into chunks of 2, each one is a question response.
		# Convert them into integers.
		# These are the raw answers given by the student.
		self.answers = map(process_utils.int_if_possible, process_utils.split_into_chunks(data[45:(45 + 2 * TEST_LENGTH)], 2))

	def init_prescored(self, data):
		# Split into component answers.
		data = data.split(',')
		# Record if each answer was correct.
		self.scores = map(process_utils.int_if_possible, data)

	# Set this student's scores, given an answer key.
	def score(self, answer_key):
		self.scores = []
		for i in range(0, len(answer_key)):
			if self.answers[i] == answer_key[i]:
				self.scores.append(True)
			else:
				self.scores.append(False)
		return

	# Returns if a student was right for a question number.
	def is_right(self, index):
		return self.scores[index]

	# Returns a numeric grade from a percentage given a dictionary of grade boundaries.
	def percentage_to_grade(self, percentage, grade_boundaries = None):
		if not grade_boundaries:
			# Standard University of Auckland grade boundaries.
			grade_boundaries = [
			{
				'grade': 'A+',
				'percentage': 90
			},
			{
				'grade': 'A',
				'percentage': 85
			},
			{
				'grade': 'A-',
				'percentage': 80
			},
			{
				'grade': 'B+',
				'percentage': 75
			},
			{
				'grade': 'B',
				'percentage': 70
			},
			{
				'grade': 'B-',
				'percentage': 65
			},
			{
				'grade': 'C+',
				'percentage': 60
			},
			{
				'grade': 'C',
				'percentage': 55
			},
			{
				'grade': 'C-',
				'percentage': 50
			},
			{
				'grade': 'D+',
				'percentage': 45
			},
			{
				'grade': 'D',
				'percentage': 40
			},
			{
				'grade': 'D-',
				'percentage': 0
			},
			]

		for grade in grade_boundaries:
			if percentage >= grade['percentage']:
				return grade['grade']

		return 'D-'

	# Returns the raw percentage of questions correct.
	def raw_percentage(self):
		num_correct = 0
		for i in range(0, len(self.scores)):
			if self.scores[i]:
				num_correct += 1

		# Check for division by zero errors, and force the percentage to be a float.
		if len(self.scores) == 0:
			return 0
		else:
			return num_correct / (len(self.scores) * 1.0) * 100