import process_utils

# Constants.
# Standard University of Auckland grade boundaries.
DEFAULT_GRADE_BOUNDARIES = [
{
	'grade': 'A+',
	'value': 90
},
{
	'grade': 'A',
	'value': 85
},
{
	'grade': 'A-',
	'value': 80
},
{
	'grade': 'B+',
	'value': 75
},
{
	'grade': 'B',
	'value': 70
},
{
	'grade': 'B-',
	'value': 65
},
{
	'grade': 'C+',
	'value': 60
},
{
	'grade': 'C',
	'value': 55
},
{
	'grade': 'C-',
	'value': 50
},
{
	'grade': 'D+',
	'value': 45
},
{
	'grade': 'D',
	'value': 40
},
{
	'grade': 'D-',
	'value': 0
},
]

# Standard UoA grade ranges.
DEFAULT_UOA_GRADE_RANGES = {
	'A': {
		'range': 20,
		'lowest': 80
	},
	'B': {
		'range': 15,
		'lowest': 65
	},
	'C': {
		'range': 15,
		'lowest': 50
	},
	'D': {
		'range': 50,
		'lowest': 15
	}
}

# Class representing a single student.
class Student:
	# Initialize and retrieve student data from the data string.
	# @param data {string} The student data.
	def __init__(self, data, prescored, test = None, position = None):
		# {!Test} The test containing this question.
		self.test = test
		# {string} ID number.
		self.id = position if position != None else 'ID not given'
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
		# {number} The student's location.
		self.location = None

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
		self.answers = map(process_utils.int_if_possible, process_utils.split_into_chunks(data[45:], 2))

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

	# Returns a numeric grade from a value (either percentage or item score) given a dictionary of grade boundaries.
	def grade_key_to_grade(self, value, grade_boundaries = DEFAULT_GRADE_BOUNDARIES):
		for grade in grade_boundaries:
			if value >= grade['value']:
				return grade['grade']

		return 'D-'

	# Returns the raw percentage of questions correct.
	def raw_percentage(self, discarded = []):
		num_correct = 0
		for i in range(0, len(self.scores)):
			if self.scores[i] and i not in discarded:
				num_correct += 1

		# Check for division by zero errors, and force the percentage to be a float.
		if len(self.scores) == 0:
			return 0
		else:
			return num_correct / ((len(self.scores) - len(discarded)) * 1.0) * 100

	# Finds the location for this student..
	def get_location(self):
		# Calculate and cache the location.
		if self.location is None:
			self.test.calculate_student_stats()

		return self.location

	# Returns a percentage grade from a value given a dictionary of grade boundaries.
	def grade_key_to_percentage(self, value, min_score, max_score, grade_boundaries = DEFAULT_GRADE_BOUNDARIES):
		ranges = DEFAULT_UOA_GRADE_RANGES
		# The highest and lowest values for this range.
		highest = max_score
		lowest = min_score
		# For each grade.
		for grade in grade_boundaries:
			print('to percentage now', grade, grade_boundaries)
			letter_grade = grade['grade']
			# Check if the value is in the grade boundaries.
			if value >= grade['value'] and len(letter_grade) > 1 and letter_grade[1] == '-':
				lowest = grade['value']
				# Set the letter grade, and lowest possible value.
				# Cut the letter grade to one character.
				if len(letter_grade) > 1:
					letter_grade = letter_grade[0]
				grade_range = highest - lowest
				# Factor converting between the value range and the percentage range.
				factor = ranges[letter_grade]['range'] / grade_range
				part_in_grade_range = (value - lowest)
				# The lowest percentage of that grade, plus the percentage * the range.
				return ranges[letter_grade]['lowest'] + (factor * part_in_grade_range)
			elif len(letter_grade) > 1 and letter_grade == '-':
				# Change the highest boundary to the previous grade.
				highest = grade['value']

		return 0