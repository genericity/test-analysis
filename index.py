from flask import Flask, render_template, url_for, session, request, g
import rpy2.robjects as robjects
import file_processing
import sqlite3
import db

# Define the application.
app = Flask(__name__)
app.debug = True
app.secret_key = 'a>Sx9dxf7xdf_xcb84002xdcN?xf6xabj;8?x83abe2j'

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

		# Read the file data.
		if 'file-student-data' in request.files and request.files['file-student-data'].filename != '':
			student_data = request.files['file-student-data'].read()
		if 'file-version-data' in request.files and request.files['file-version-data'].filename != '':
			version_data = request.files['file-version-data'].read()
		if 'file-question-data' in request.files  and request.files['file-question-data'].filename != '':
			question_data = request.files['file-question-data'].read()

		# Process. This will set session variables.
		file_processing.save_raw_data(student_data, version_data, question_data)

	# Display the questions page.
	return render_template('questions.html', questions = True, data = data)

@app.route('/grades')
def grades_page():
    return render_template('grades.html', grades = True)

@app.route('/review')
def review_page():
    return render_template('review.html', review = True)

@app.route('/export')
def export_page():
    return render_template('export.html', export = True)

@app.route('/get/questions')
def question_data():
	return file_processing.get_question_data()

# Initializes the database. The readme file contains instructions on how to run this at the start of installing the application.
def init_db():
    with app.app_context():
        database = db.get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            database.cursor().executescript(f.read())
        database.commit()

# Closes any current database connections.
@app.teardown_appcontext
def close_connection(exception):
    database = getattr(g, '_database', None)
    if database is not None:
        database.close()