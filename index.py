from flask import Flask, render_template, url_for, session, request, g
import rpy2.robjects as robjects
import file_processing
import sqlite3
import db
import os

# Define the application.
app = Flask(__name__)
app.debug = True
# Random secret key, so session cookies cannot be modified to gain access to other sessions even by the administrators.
app.secret_key = os.urandom(24)
# Default grade boundaries. These should never be used, but it is good to have
# failsafes in case a user navigates to a page before the page has the necessary information.
DEFAULT_AB_BOUNDARY = 0.5
DEFAULT_BC_BOUNDARY = -0.5
DEFAULT_CD_BOUNDARY = -2

# R setup.
r = robjects.r

# App routing.
@app.route('/')
def upload_page():
    return render_template('index.html', upload = True)

@app.route('/questions', methods = ['GET', 'POST'])
def questions_page():
	metadata = None

    # Process the data.
	if request.method == 'POST':
		# The posted data.
		data = request.files
		student_data = None
		version_data = None
		question_data = None

		# Type of data format.
		file_type = request.form['file-type']

		# Response and answer files.
		if file_type == 'response-answer':
			# Read the file data.
			if 'file-student-data' in request.files and request.files['file-student-data'].filename != '':
				student_data = request.files['file-student-data'].read()
			if 'file-version-data' in request.files and request.files['file-version-data'].filename != '':
				version_data = request.files['file-version-data'].read()
		# Prescored file.
		if file_type == 'prescored':
			# Read the file data.
			if 'file-prescored-data' in request.files and request.files['file-prescored-data'].filename != '':
				student_data = request.files['file-prescored-data'].read()

		# Read the question text regardless.
		if 'file-question-data' in request.files and request.files['file-question-data'].filename != '':
			question_data = request.files['file-question-data'].read()
		

		# Process. This will set session variables.
		file_processing.save_raw_data(student_data, version_data, question_data)

		test = file_processing.load_test()
		# Populate the metadata as it doesn't exist.
		file_processing.populate_metadata(test)
		# Populate the default boundaries as it doesn't exist.
		file_processing.populate_default_boundaries(test)

	# Set metadata.
	if session.get('num_files'):
		metadata = {
			'num_files': session['num_files'],
			'num_students': session['num_students'],
			'num_questions': session['num_questions'],
			'first_student': session['first_student'],
			'last_student': session['last_student']
		}

	# Display the questions page.
	return render_template('questions.html', questions = True, data = metadata)

@app.route('/grades', methods = ['GET', 'POST'])
def grades_page():
	discard = []
	# Process the data.
	if request.method == 'POST':
		# All the questions that were checked, i.e. need to be discarded.
		discard = request.form.getlist('question')
		# Process the discarded questions.
		file_processing.save_discarded_questions(discard)

	boundaries = db.get_grade_boundaries(session['id'])

	# The first time the user visits this page, no boundaries have been set yet.
	ab = session['natural_ab']
	bc = session['natural_bc']
	cd = session['natural_cd']

	# If boundaries have been saved into the database.
	if boundaries:
		ab = boundaries[0]
		bc = boundaries[1]
		cd = boundaries[2]

	return render_template('grades.html', grades = True, ab = ab, bc = bc, cd = cd)

@app.route('/grades-confirm', methods = ['GET', 'POST'])
def confirm_page():
	# The result of submitting the previous grades page.
	# Process the data.
	if request.method == 'POST':
		# All the grade boundaries.
		ab_boundary = float(request.form.get('ab-boundary') or session['natural_ab'])
		bc_boundary = float(request.form.get('bc-boundary') or session['natural_bc'])
		cd_boundary = float(request.form.get('cd-boundary') or session['natural_cd'])
		# Save the boundaries into the database.
		file_processing.save_boundaries(ab_boundary, bc_boundary, cd_boundary)

		# Delete any existing subboundaries.
		subboundaries = db.get_grade_subboundaries(session['id'])
		if subboundaries:
			db.delete_grade_subboundaries(session['id'])

	boundaries = db.get_grade_boundaries(session['id'])

	ab = session['natural_ab']
	bc = session['natural_bc']
	cd = session['natural_cd']
	ap = session['natural_ap']
	a = session['natural_a']
	bp = session['natural_bp']
	b = session['natural_b']
	cp = session['natural_cp']
	c = session['natural_c']
	dp = session['natural_dp']
	d = session['natural_d']

	if boundaries:
		ab = boundaries[0]
		bc = boundaries[1]
		cd = boundaries[2]

	if subboundaries:
		ap = subboundaries[0]
		a = subboundaries[1]
		bp = subboundaries[2]
		b = subboundaries[3]
		cp = subboundaries[4]
		c = subboundaries[5]
		dp = subboundaries[6]
		d = subboundaries[7]

	return render_template('grades-confirm.html', confirm = True, ab = ab, bc = bc, cd = cd, ap = ap, a = a, bp = bp, b = b, cp = cp, c = c, dp = dp, d = d)

@app.route('/review', methods = ['GET', 'POST'])
def review_page():
	# The result of submitting the previous subgrade boundaries page.
	# Process the data.
	if request.method == 'POST':
		# All the grade boundaries.
		ids = ['ap', 'a', 'bp', 'b', 'cp', 'c', 'dp', 'd']
		subboundaries = []
		for subboundary in ids:
			boundary = float(request.form.get(subboundary + '-boundary') or session['natural_' + subboundary])
			subboundaries.append(boundary)

		# Save the boundaries into the database.
		file_processing.save_subboundaries(subboundaries)

	return render_template('review.html', review = True)

@app.route('/export')
def export_page():
    return render_template('export.html', export = True)

@app.route('/get/questions')
def question_data():
	return file_processing.get_question_data()

@app.route('/get/students')
def student_data():
	return file_processing.get_student_data()

# Initializes the database. The readme file contains instructions on how to run this at the start of installing the application.
def init_db():
    with app.app_context():
        database = db.get_db()
        with app.open_resource('schema.sql', mode = 'r') as f:
            database.cursor().executescript(f.read())
        database.commit()

# Closes any current database connections.
@app.teardown_appcontext
def close_connection(exception):
    database = getattr(g, '_database', None)
    if database is not None:
        database.close()

if __name__ == "__main__":
	app.debug = False
	app.run(host = "0.0.0.0", port = 80, threaded = True)