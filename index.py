from flask import Flask
from flask import render_template

app = Flask(__name__, static_url_path='')
app.debug = True

# Static file routing.
url_for('files', filename='css/style.css')
url_for('files', filename='js/chart.js')
url_for('files', filename='js/annotations.js')
url_for('files', filename='js/visualize.js')

@app.route('/')
def upload_page():
    return render_template('index.html')