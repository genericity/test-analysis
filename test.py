import re
from student import Student
from question import Question
import rpy2.robjects as robjects
from rpy2.robjects.packages import importr

# Represents an entire test.
class Test:
	def __init__(self, students, versions, text = None, discarded = [], boundaries = None):
		# {!Array<!Student>} An array of students.
		self.students = students
		# {Object<string, !Array<number>>} Dictionary mapping the version names to their answer keys.
		self.versions = versions

		if students and versions:
			self.score_all()

		if students:
			self.test_length = len(self.students[0].scores)
			# Store a reference to this test in each student object.
			for i in range(len(self.students)):
				self.students[i].test = self

		# {!Array<!Question>} The array of questions within the test.
		self.questions = self.init_questions(text, discarded)
		# {number} The length of the test.
		self.test_length = len(self.questions)

		# {number} The grade boundary between A and B.
		self.ab = None
		# {number} The grade boundary between B and C.
		self.bc = None
		# {number} The grade boundary between C and D.
		self.cd = None

		if boundaries:
			self.ab = boundaries[0]
			self.bc = boundaries[1]
			self.cd = boundaries[2]

	# Score all the students.
	def score_all(self):
		for student in self.students:
			version = self.get_version(student.version)
			answer_key = self.versions[version]
			student.score(answer_key)

	# Find the difficulty of a question given its index.
	def get_percentage_correct(self, index):
		if index >= self.test_length:
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

	# Initializes the array of question objects.
	def init_questions(self, text_array, discard_array):
		questions = []

		for i in range(self.test_length):
			# The percentage of students that got this question correct.
			percentage = self.get_percentage_correct(i)
			# The text for the question, if it exists.
			text = text_array[i] if text_array and len(text_array) - 1 >= i else ''
			# If this question was marked as to discard or not.
			discard = ((i + 1) in discard_array)

			# Create the question.
			question = Question(self, percentage_correct = percentage, text = text, discard = discard)

			questions.append(question)

		return questions

	# Given a string, guess which version it is most likely to be.
	def get_version(self, version_string):
		# Start by trying out a direct comparison.
		for version_name in self.versions.keys():
			if version_name == version_string:
				return version_string

		# Strip the non-numeric characters from the versions we have.
		for version_name in self.versions.keys():
			version_stripped = int(re.sub("\D", "", version_name))
			# Compare it to the integer value of the version given without the course code (first three characters).
			version_cutoff = int(version_string[3:])
			if version_stripped == version_cutoff:
				return version_name

		# Return the first key as a default.
		return self.versions.keys()[0]

	# Outputs question data in a CSV-like format, comma-delineated.
	def to_question_csv(self):
		# Full array of question data.
		questions = []

		# Go through all the questions and retrieve information about each one.
		for i in range(self.test_length):
			question = self.questions[i]
			text = question.text
			percentage = question.percentage_correct
			discrimination = question.get_discrimination()
			weight = question.get_item_weight()
			kept = not question.discard

			# Create the question array.
			question_array = []
			question_array.append(i)
			question_array.append(text)
			question_array.append(percentage)
			question_array.append(discrimination)
			question_array.append(weight)
			question_array.append(kept)

			# Convert to string.
			question_array = list(map(str, question_array))

			questions.append(','.join(question_array))

		# Return the joined string.
		return '\n'.join(questions)

	# Sets item weights and discriminations for the questions.
	def calculate_question_stats(self, response_matrix = None):
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

		# Store inside the questions.
		for i in range(len(self.questions)):
			question = self.questions[i]

			# Cache the discrimination.
			# R vectors are 1-indexed.
			question.discrimination = discriminations.rx2(i + 1)[0]
			# Cache the item weight.
			# R vectors are 1-indexed.
			question.item_weight = item_weights.rx2(i + 1)[0]

	# Sets locations for the students.
	def calculate_student_stats(self, response_matrix = None):
		response_matrix = response_matrix or self.get_response_matrix()

		# Assign to a symbol.
		robjects.globalenv['response_matrix'] = response_matrix

		# Use ltm.
		importr('ltm')
		robjects.r('item_scores <- ltm(response_matrix ~ z1, na.action = NULL)')
		robjects.r('locations <- factor.scores(item_scores, resp.patterns = response_matrix)')

		# Store a row of location coefficients.
		locations = robjects.r('locations$score.dat["z1"]')

		# Store inside the questions.
		for i in range(len(self.students)):
			student = self.students[i]

			# Cache the discrimination.
			# R vectors are 1-indexed.
			student.location = locations.rx(i + 1, 'z1')[0]

	# Returns the matrix of responses in a dataframe / ltm-usable format.
	def get_response_matrix(self):
		matrix = {}

		# For each question:
		for question_index in range(self.test_length):
			question_response_vector = []

			question = self.questions[question_index]

			# Cannot have questions where either 100% or 0% were correct, as ltm will crash.
			# This also excludes questions the user has opted to discard.
			if not question.discard:
				# Retrieve all the responses for each student.
				for j in range(len(self.students)):
					question_response_vector.append(self.students[j].is_right(question_index))
			else:
				# Otherwise, create a vector of NA objects.
				question_response_vector = [robjects.NA_Logical] * len(self.students)

			# Convert to a vector.
			matrix[question_index + 1] = robjects.BoolVector(question_response_vector)

		# Convert the dictionary of vectors to a dataframe.
		response_matrix = robjects.DataFrame(matrix)

		return response_matrix

	def min_student_location(self):
		min_score = 100000
		for i in range (len(self.students)):
			location = self.students[i].get_location()
			if location < min_score and not location == None:
				min_score = location

		return min_score

	def max_student_location(self):
		max_score = -100000
		for i in range (len(self.students)):
			location = self.students[i].get_location()
			if location > max_score and not location == None:
				max_score = location

		return max_score

	# Outputs question data in a CSV-like format, comma-delineated.
	def to_student_csv(self):
		if (len(self.students) == 0):
			return ''

		# Full array of student data.
		students = []

		# Grade boundary key.
		boundaries = [self.ab, self.bc, self.cd]
		min_location = self.min_student_location()
		max_location = self.max_student_location()
		print boundaries, min_location, max_location
		grade_boundaries = self.students[0].item_score_to_grade_boundaries(boundaries, min_location, max_location)
		print grade_boundaries

		# Go through all the students and retrieve information about each one.
		# Limit the range to 50 to avoid freezing up.
		for i in range (0, len(self.students)):
		# for i in range(0, 50):
			student = self.students[i]

			student_id = student.id
			raw_percentage = student.raw_percentage()
			raw_grade = student.grade_key_to_grade(raw_percentage)
			analyzed_percentage = 0
			analyzed_score = student.get_location()
			recommended_percentage = 0
			recommended_grade = student.grade_key_to_grade(student.get_location(), grade_boundaries)

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