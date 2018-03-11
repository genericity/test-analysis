from flask import Flask
from flask import render_template
from flask import url_for

app = Flask(__name__)
app.debug = True

@app.route('/')
def upload_page():
    return render_template('index.html', upload = True)

@app.route('/questions')
def questions_page():
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