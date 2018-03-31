import sqlite3
from flask import g

DATABASE = 'database.db'

# Retrieves the current connection.
def get_db():
    database = getattr(g, '_database', None)
    if database is None:
        database = g._database = sqlite3.connect(DATABASE)
    database.row_factory = make_dicts
    return database

# Converts a SQLite Row into a dictionary.
def make_dicts(cursor, row):
	return dict((cursor.description[idx][0], value) for idx, value in enumerate(row))

# Inserts raw student and question data into the database.
def insert_raw(raw_student_data, raw_version_data):
 	cursor = get_db().cursor()
 	query_db('insert into responses (data) values (?);', [raw_student_data], cursor = cursor)
 	session_id = cursor.lastrowid
 	query_db('insert into answers (session_id, data) values (?, ?);', [session_id, raw_version_data])
 	return session_id

# Inserts the list of discarded questions into the database.
def insert_or_update_discarded(session_id, discarded_str):
 	cursor = get_db().cursor()

 	# If the session ID is not set, return.
 	if not session_id:
 		return

 	# If there are no existing rows in the database, insert.
 	if not get_discarded(session_id):
 		query_db('insert into discarded (session_id, questions) values (?,?);', [session_id, discarded_str], cursor = cursor)
 	# Otherwise, update the existing entry.
 	else:
 		query_db('update discarded set questions = ? where session_id = ? limit 1;', [discarded_str, session_id], cursor = cursor)

# Retrieves response data from the database given a session id.
def get_responses(session_id):
	result = query_db('select * from responses where ROWID = ?;', [session_id], one = True)
	return result

# Retrieves answer data from the database given a session id.
def get_answers(session_id):
	result = query_db('select * from answers where session_id = ?;', [session_id], one = True)
	return result

# Retrieves the list of discarded questions from the database given a session id.
def get_discarded(session_id):
	result = query_db('select * from discarded where session_id = ?;', [session_id], one = True)
	return result

# Queries the database.
def query_db(query, args = (), cursor = False, one = False):
	cursor = cursor or get_db().cursor()
	cursor.execute(query, args)
	results = cursor.fetchall()
	# Save changes to the database.
	get_db().commit()
	# Close the connection.
	cursor.close()
	return (results[0] if results else None) if one else results