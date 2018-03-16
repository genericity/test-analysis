from flask import Flask
from flask import render_template
from flask import url_for
from flask import session
import rpy2.robjects as robjects
from flask.ext.session import Session

# Define the application.
app = Flask(__name__)
app.debug = True

# Start the session.
SESSION_TYPE = 'redis'
app.config.from_object(__name__)
Session(app)

# R setup.
r = robjects.r

# App routing.
@app.route('/')
def upload_page():
    return render_template('index.html', upload = True)

@app.route('/questions', methods = ['GET', 'POST'])
def questions_page():
	# Display the questions page.
	if request.method == 'GET':
    	return render_template('questions.html', questions = True)
    # Process the data.
	if request.method == 'POST':
		data = request.form
		return data

@app.route('/grades')
def grades_page():
    return render_template('grades.html', grades = True)

@app.route('/review')
def review_page():
    return render_template('review.html', review = True)

@app.route('/export')
def export_page():
    return render_template('export.html', export = True)

def score_students():
	return

def is_correct_answer():
	return False