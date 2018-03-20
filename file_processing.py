from flask import session, g
from test import Test
from student import Student
import db

# Converts a student data file into an array of student objects.
def to_student_array(student_data):
	students = []
	raw = student_data.splitlines()
	for line in raw:
		students.append(Student(line))
	return students

# Converts a version answer data file into a dictionary of answer keys.
def to_version_dict(version_data, first_column = True):
	versions = {}
	version_array = version_data.splitlines()

	# Return if the file was just a header, or empty.
	if len(version_array) < 2:
		return versions

	# Convert each line to an array.
	for i in range(0, len(version_array)):
		version_array[i] = version_array[i].split()
		# Remove the first column if applicable.
		if first_column:
			version_array[i].pop(0)

	# Names of versions.
	version_names = version_array.pop(0)
	# Number of versions.
	num_versions = len(version_names)

	# Set up the answer key arrays in the dictionary.
	for i in range(0, num_versions):
		versions[version_names[i]] = []

	# Populate the answer keys.
	for line_index in range(0, len(version_array)):
		for i in range(0, num_versions):
			answer = version_array[line_index][i]
			versions[version_names[i]].append(int(answer))

	return versions

# Processes raw data and sets session variables.
def process_raw_data(raw_student_data, raw_version_data, raw_question_data):
	session['id'] = db.insert_raw(raw_student_data, raw_version_data)

	# Convert the tab-delineated file to an array of actual student objects.
	students = to_student_array(raw_student_data)
	versions = to_version_dict(raw_version_data)
	test = Test(students, versions, raw_question_data)

	print db.get_responses(session['id'])
