import process_utils

# Constants.
TEST_LENGTH = 30

# Class representing a single student.
class Student:
	# Initialize and retrieve student data from the data string.
	# @param data {string} The student data.
	def __init__(self, data):
		# {string} ID number.
		self.id = data[2:11].strip()
		# {string} Last name.
		self.last_name = data[12:25].strip()
		# {string} First name.
		self.first_name = data[25:33].strip()
		# {string} Version of the test.
		self.version = data[33:44].strip()
		# {!Array<boolean>} Whether each question was right or not.
		self.scores = []

		# Split into chunks of 2, each one is a question response.
		# Convert them into integers.
		# {!Array<number>} The raw answers given by the student.
		self.answers = map(process_utils.int_if_possible, process_utils.split_into_chunks(data[45:(45 + 2 * TEST_LENGTH)], 2))

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