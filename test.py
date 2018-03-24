import re
from student import Student
import rpy2.robjects as robjects
from rpy2.robjects.packages import importr

# Constants.
TEST_LENGTH = 30

# Represents an entire test.
class Test:
	def __init__(self, students, versions, text = None):
		# {!Array<!Student>} An array of students.
		self.students = students
		# {Object<string, !Array<number>>} Dictionary mapping the version names to their answer keys.
		self.versions = versions
		# {Array<string>} List of question text strings.
		self.text = text
		# {R} R object containing a vector of discriminations.
		self.discriminations = None
		# {R} R object containing a vector of item weights.
		self.item_scores = None

		if students and versions:
			self.score_all()

	# Score all the students.
	def score_all(self):
		for student in self.students:
			version = self.get_version(student.version)
			answer_key = self.versions[version]
			student.score(answer_key)

	# Find the difficulty of a question given its index.
	def get_percentage_correct(self, index):
		if index >= TEST_LENGTH:
			return 0

		# Number of students that were right for this question..
		right = 0
		# Query each student to see if they were right for this question.
		for student in self.students:
			if student.is_right(index):
				right += 1

		# Return the percentage of students right.
		if len(self.students) == 0:
			return 0
		else:
			# Force the answer to be floating point.
			return right / (len(self.students) * 1.0) * 100

	# Given a string, guess which version it is most likely to be.
	def get_version(self, version_string):
		# Start by trying out a direct comparison.
		for version_name in self.versions.keys():
			if version_name == version_string:
				return version_string

		# Strip the non-numeric characters from the versions we have.
		for version_name in self.versions.keys():
			version_stripped = int(re.sub("\D", "", version_name))
			# Compare it to the integer value of the last 5 letters of the version given.
			version_cutoff = int(version_string[-5:])
			if version_stripped == version_cutoff:
				return version_name

		# Return the first key as a default.
		return self.versions.keys()[0]

	# Outputs question data in a CSV-like format, comma-delineated.
	def to_question_csv(self):
		# Full array of question data.
		questions = []

		# Go through all the questions and retrieve information about each one.
		for i in range(0, TEST_LENGTH):
			text = ''
			percentage = self.get_percentage_correct(i)
			discrimination = self.get_discrimination(i)
			weight = self.get_item_weight(i)

			# Create the question array.
			question = []
			question.append(i)
			question.append(text)
			question.append(percentage)
			question.append(discrimination)
			question.append(weight)

			# Convert to string.
			question = list(map(str, question))

			questions.append(','.join(question))

		# Return the joined string.
		return '\n'.join(questions)

	# Sets item weights and discriminations for the questions.
	def calculate_question_stats(self, response_matrix = None):
		response_matrix = response_matrix or self.get_response_matrix()

		# Assign to a symbol.
		robjects.globalenv['response_matrix'] = response_matrix

		# Use ltm.
		importr('ltm')
		robjects.r('item_scores <- ltm(response_matrix ~ z1)')

		# Store a row of discrimination coefficients.
		self.discriminations = robjects.r('item_scores[1]$coefficients[,2]')
		# Store a row of item weights. This vector contains 'difficulties' from
		# positions 1 to TEST_LENGTH, then 'discriminations' from positions
		# TEST_LENGTH + 1 to 2 * TEST_LENGTH.
		self.item_scores = robjects.r('summary(item_scores)$coefficients[,1]')

	# Returns the matrix of responses in a dataframe / ltm-usable format.
	def get_response_matrix(self):
		matrix = {}

		# For each question:
		for question_index in range(TEST_LENGTH):
			question_response_vector = []

			# Retrieve all the responses for each student.
			for j in range(len(self.students)):
				question_response_vector.append(self.students[j].is_right(question_index))
			
			# Convert to integer values.
			question_response_vector = map(int, question_response_vector)
			matrix[question_index] = robjects.IntVector(question_response_vector)

		response_matrix = robjects.DataFrame(matrix)
		return response_matrix

	# Retrieve the discrimination for a specific question.
	def get_discrimination(self, index):
		# Calculate and cache the discrimination row.
		if self.discriminations is None:
			self.calculate_question_stats()

		# R vectors are 1-indexed.
		index += 1
		if (index < 1 or index > TEST_LENGTH):
			return 0

		# Retrieve the discrimination.
		return self.discriminations.rx2(index)[0]

	# Retrieve the item weight for a specific question.
	def get_item_weight(self, index):
		# Calculate and cache the item weight row.
		if self.item_scores is None:
			self.calculate_question_stats()

		# R vectors are 1-indexed.
		index += 1
		if (index < 1 or index > TEST_LENGTH):
			return 0

		# Retrieve the discrimination.
		return self.item_scores.rx2(index)[0]

	# Outputs question data in a CSV-like format, comma-delineated.
	def to_student_csv(self):
		# Full array of student data.
		students = []

		# Go through all the students and retrieve information about each one.
		# Limit the range to 50 to avoid freezing up.
		# for i in range (0, len(self.students)):
		for i in range(0, 50):
			student = self.students[i]

			student_id = student.id
			raw_percentage = student.raw_percentage()
			raw_grade = student.percentage_to_grade(raw_percentage)
			analyzed_percentage = 0
			analyzed_score = 0
			recommended_percentage = 0
			recommended_grade = 0

			# Create the question array.
			student_array = []
			student_array.append(student_id)
			student_array.append(raw_percentage)
			student_array.append(raw_grade)
			student_array.append(analyzed_percentage)
			student_array.append(analyzed_score)
			student_array.append(recommended_percentage)
			student_array.append(recommended_grade)

			# Convert to string.
			student_array = list(map(str, student_array))

			students.append(','.join(student_array))

		# Return the joined string.
		return '\n'.join(students)