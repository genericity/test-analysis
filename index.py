from flask import Flask, render_template, url_for, session, request
import rpy2.robjects as robjects
import file_processing

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
    # Process the data.
	if request.method == 'POST':
		# The posted data.
		data = request.files
		student_data = request.files['file-student-data'].read() or None
		version_data = request.files['file-version-data'].read() or None
		question_data = request.files['file-question-data'].read() or None

		# Process. This will set session variables.
		file_processing.process_raw_data(student_data, version_data, question_data)

	# Display the questions page.
	return render_template('questions.html', questions = True)

@app.route('/grades')
def grades_page():
    return render_template('grades.html', grades = True)

@app.route('/review')
def review_page():
    return render_template('review.html', review = True)

@app.route('/export')
def export_page():
    return render_template('export.html', export = True)