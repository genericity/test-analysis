import re
from student import Student

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

		self.score_all()

	# Score all the students.
	def score_all(self):
		for student in self.students:
			version = self.get_version(student.version)
			answer_key = self.versions[version]
			student.score(answer_key)

	# Find the difficulty of a question given its index.
	def get_question_difficulty(self, index):
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
			return right / (len(self.students) * 1.0)

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