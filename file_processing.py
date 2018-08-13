from flask import session, g
from test import Test
from student import Student
import db
import re
import process_utils

DEFAULT_AB_BOUNDARY = 0.5
DEFAULT_BC_BOUNDARY = -0.5
DEFAULT_CD_BOUNDARY = -2

# Set up a database object.
database_manager = db.Database()

# Converts a student data file into an array of student objects.
def to_student_array(student_data, prescored = False, test_length = 30):
	# Clean data of carriage returns first.
	student_data = re.sub(r'\r', '', student_data)
	# Substitute tabs with seven spaces to account for empty names.
	student_data = re.sub(r'\t', '       ', student_data)

	# Student array.
	students = []
	raw = student_data.splitlines()
	for i in range(len(raw)):
		line = raw[i]
		# Make sure the line is not empty.
		if len(line) > 0:
			students.append(Student(line, prescored, test_length, position = i))
	return students

# Converts a version answer data file into a dictionary of answer keys.
def to_version_dict(version_data, first_column = True):
	if not version_data:
		return None

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

# Converts raw question text data into an array.
def to_text_array(raw_question_data):
	if not raw_question_data:
		return None

	return raw_question_data.splitlines()

# Saves raw data and sets session variables.
def save_raw_data(raw_student_data, raw_version_data, raw_question_data):
	session['id'] = database_manager.insert('uploads', ['responses', 'answers', 'question_texts'], [raw_student_data, raw_version_data, raw_question_data])

	# Set the number of files.
	session['num_files'] = 0
	if raw_student_data:
		session['num_files'] += 1
	if raw_version_data:
		session['num_files'] += 1
	if raw_question_data:
		session['num_files'] += 1

# Populates session metadata about the test.
def populate_metadata(preloaded_test = None):
	test = preloaded_test or load_test()
	session['num_questions'] = test.test_length
	session['num_students'] = len(test.students)
	session['first_student'] = test.students[0].id
	session['last_student'] = test.students[-1].id
	session['versions'] = bool(test.versions != None and (len(test.versions.keys()) > 0))
	if (session['versions']):
		session['versions_students'] = ', '.join(list(test.student_versions))
		session['versions_answer_key'] = ', '.join(test.versions.keys())


# Populates default grade boundaries about the test.
def populate_default_boundaries(preloaded_test = None):
	test = preloaded_test or load_test()
	ab_student_locations = []
	bc_student_locations = []
	cd_student_locations = []

	# Get the mean location of students with a raw percentage of between 75 - 85%.
	# Why not just 80% precisely? Some tests may have an odd number of questions, non-multiple of 5, etc., so that no students get exactly 80% on the test.
	for student in test.students:
		percentage = student.raw_percentage()
		if percentage >= 75 and percentage < 85:
			ab_student_locations.append(student.get_location())
		# Do the same with B/C students (60 - 70%).
		elif percentage >= 60 and percentage < 70:
			bc_student_locations.append(student.get_location())
		# And with C/D students (45 - 55%).
		elif percentage >= 45 and percentage < 55:
			cd_student_locations.append(student.get_location())

	session['natural_ab'] = process_utils.mean(ab_student_locations) if len(ab_student_locations) != 0 else DEFAULT_AB_BOUNDARY
	session['natural_bc'] = process_utils.mean(bc_student_locations) if len(bc_student_locations) != 0 else DEFAULT_BC_BOUNDARY
	session['natural_cd'] = process_utils.mean(cd_student_locations) if len(cd_student_locations) != 0 else DEFAULT_CD_BOUNDARY

# Saves the list of discarded questions.
def save_discarded_questions(discarded_list):
	database_manager.insert_or_update_from('discarded_questions', session['id'], discarded_list)

# Saves the grade boundaries.
def save_boundaries(boundaries, preloaded_test = None):
	database_manager.insert_or_update_from('boundaries', session['id'], boundaries)

	test = preloaded_test or load_test()

	# Calculate the natural grade subboundaries.
	subboundaries = test.calculate_subboundaries(boundaries)

	# Set the subboundaries.
	session['natural_ap'] = subboundaries[0]['value']
	session['natural_a'] = subboundaries[1]['value']
	session['natural_bp'] = subboundaries[3]['value']
	session['natural_b'] = subboundaries[4]['value']
	session['natural_cp'] = subboundaries[6]['value']
	session['natural_c'] = subboundaries[7]['value']
	session['natural_dp'] = subboundaries[9]['value']
	session['natural_d'] = subboundaries[10]['value']

# Saves the grade boundaries.
def save_subboundaries(subboundaries):
	database_manager.insert_or_update_from('subboundaries', session['id'], subboundaries)

# Loads test data based on the session ID.
def load_test():
	if session['id'] is None:
		return ''

	# Retrieve data from the database.
	session_id = session['id']
	uploaded_data = database_manager.get_from('uploads', session_id, 'ROWID')

	# Student objects in an array.
	students = None
	# Version data.
	versions = None
	# Convert the question texts if it exists.
	texts = to_text_array(uploaded_data['question_texts'])

	# Determine if the data is prescored or not by if version data was uploaded.
	if uploaded_data['responses'] and not uploaded_data['answers']:
		# Convert the tab-delineated file to an array of actual student objects.
		students = to_student_array(uploaded_data['responses'], prescored = True)
	else:
		# Convert the version data if it exists.
		students = to_student_array(uploaded_data['responses'], prescored = False)
		versions = to_version_dict(uploaded_data['answers'])

	# Check if there are any discarded questions stored in the database.
	discarded = database_manager.get_from('discarded_questions', session_id)
	discarded = discarded['discarded_questions'] if discarded else None
	# Retrieve grade boundaries if it exists.
	boundaries = database_manager.get_from('boundaries', session_id)
	boundaries = boundaries['boundaries'] if boundaries else None
	# Retrieve grade subboundaries if it exists.
	subboundaries = database_manager.get_from('subboundaries', session_id)
	subboundaries = subboundaries['subboundaries'] if subboundaries else None

	# Retrieve question discriminations if it exists.
	question_discriminations = database_manager.get_from('question_discriminations', session_id)
	question_discriminations = question_discriminations['question_discriminations'] if question_discriminations else None
	# Retrieve question weights if it exists.
	question_weights = database_manager.get_from('question_weights', session_id)
	question_weights = question_weights['question_weights'] if question_weights else None

	# Retrieve student locations if it exists.
	student_locations = database_manager.get_from('student_locations', session_id)
	student_locations = student_locations['student_locations'] if student_locations else None

	test = Test(students, versions,
		discarded = discarded,
		boundaries = boundaries,
		texts = texts,
		subboundaries = subboundaries,
		question_discriminations = question_discriminations,
		question_weights = question_weights,
		student_locations = student_locations)
	return test

# Outputs question data in a comma-delineated format.
def get_question_data():
	test = load_test()
	return test.to_question_csv(encode = True)

# Outputs student data in a comma-delineated format.
def get_student_data():
	test = load_test()
	return test.to_student_csv()