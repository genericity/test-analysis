from flask import session, g
from test import Test
from student import Student
import db
import re

# Converts a student data file into an array of student objects.
def to_student_array(student_data, prescored = False):
	# Clean data of carriage returns first.
	student_data = re.sub(r'\r', '', student_data)
	# Substitute tabs with eight spaces to account for empty names.
	student_data = re.sub(r'\t', '        ', student_data)

	# Student array.
	students = []
	raw = student_data.splitlines()
	for line in raw:
		# Make sure the line is not empty.
		if len(line) > 0:
			students.append(Student(line, prescored))
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

# Saves raw data and sets session variables.
def save_raw_data(raw_student_data, raw_version_data, raw_question_data):
	session['id'] = db.insert_raw(raw_student_data, raw_version_data)

# Loads test data based on the session ID.
def load_test():
	if session['id'] is None:
		return ''

	# Retrieve data from the database.
	session_id = session['id']
	raw_student_data = db.get_responses(session_id)
	raw_version_data = db.get_answers(session_id)

	if raw_student_data is None:
		return ''

	# Student objects in an array.
	students = None
	# Version data.
	versions = None

	# Determine if the data is prescored or not by if version data was uploaded.
	if raw_student_data['data'] and not raw_version_data['data']:
		# Convert the tab-delineated file to an array of actual student objects.
		students = to_student_array(raw_student_data['data'], prescored = True)
	else:
		# Convert the version data if it exists.
		students = to_student_array(raw_student_data['data'], prescored = False)
		versions = to_version_dict(raw_version_data['data'])

	test = Test(students, versions)

	return test

# Outputs question data in a comma-delineated format.
def get_question_data():
	test = load_test()
	return test.to_question_csv()

# Outputs student data in a comma-delineated format.
def get_student_data():
	test = load_test()
	return test.to_student_csv()