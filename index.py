from flask import Flask, render_template, url_for, session, request, g
import rpy2.robjects as robjects
import file_processing
import sqlite3
import db

# Define the application.
app = Flask(__name__)
app.debug = True
# This should be locally configured.
app.secret_key = 'a>Sx9dxf7xdf_xcb84002xdcN?xf6xabj;8?x83abe2j'
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
	data = []
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
		if 'file-question-data' in request.files  and request.files['file-question-data'].filename != '':
			question_data = request.files['file-question-data'].read()
		

		# Process. This will set session variables.
		file_processing.save_raw_data(student_data, version_data, question_data)

	# Display the questions page.
	return render_template('questions.html', questions = True, data = data)

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
	if boundaries:
		return render_template('grades.html', grades = True, ab = boundaries[0], bc = boundaries[1], cd = boundaries[2])
	else:
		return render_template('grades.html', grades = True, ab = DEFAULT_AB_BOUNDARY, bc = DEFAULT_BC_BOUNDARY, cd = DEFAULT_CD_BOUNDARY)

@app.route('/review', methods = ['GET', 'POST'])
def review_page():
	# The result of submitting the previous grades page.
	# Process the data.
	if request.method == 'POST':
		# All the grade boundaries.
		ab_boundary = request.form.get('ab-boundary') or DEFAULT_AB_BOUNDARY
		bc_boundary = request.form.get('bc-boundary') or DEFAULT_BC_BOUNDARY
		cd_boundary = request.form.get('cd-boundary') or DEFAULT_CD_BOUNDARY
		# Save the boundaries into the database.
		file_processing.save_boundaries(ab_boundary, bc_boundary, cd_boundary)

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