import sqlite3
from flask import g

DATABASE = 'database.db'

# Retrieves the current connection.
def get_db():
    database = getattr(g, '_database', None)
    if database is None:
        database = g._database = sqlite3.connect(DATABASE)
    database.row_factory = sqlite3.Row
    return database

# Inserts raw student and question data into the database.
def insert_raw(raw_student_data, raw_version_data):
 	cursor = get_db().cursor()
 	query_db('insert into responses (data) values (?);', [raw_student_data], cursor = cursor)
 	session_id = cursor.lastrowid
 	query_db('insert into answers (session_id, data) values (?, ?);', [session_id, raw_student_data])
 	return session_id

# Retrieves response data from the database given a session id.
def get_responses(session_id):
	result = query_db('select * from responses where ROWID = ?', [session_id], one = True)
	return result

# Retrieves answer data from the database given a session id.
def get_answers(session_id):
	result = query_db('select * from responses where session_id = ?', [session_id], one = True)
	return result

# Converts a SQLite Row into a dictionary.
def make_dicts(cursor, row):
	return dict((cursor.description[idx][0], value) for idx, value in enumerate(row))

# Queries the database.
def query_db(query, args = (), cursor = False, one = False):
	cursor = cursor or get_db().cursor()
	cursor.execute(query, args)
	results = cursor.fetchall()
	cursor.close()
	return (results[0] if results else None) if one else results