from flask import Flask, render_template, url_for, session, request, g
import rpy2.robjects as robjects
import file_processing
import sqlite3
import db
import os

# Define the application.
app = Flask(__name__)
app.debug = False

# Random secret key, so session cookies cannot be modified to gain access to other sessions even by the administrators.
app.secret_key = os.urandom(24)

# R setup.
r = robjects.r

# Set up a database object.
database_manager = db.Database()

# Initializes the database. The readme file contains instructions on how to run this at the start of installing the application.
def init_db():
    with app.app_context():
        database = database_manager.get_db()
        with app.open_resource('schema.sql', mode = 'r') as f:
            database.cursor().executescript(f.read())
        database.commit()
		
if __name__ == "__main__":
	init_db()