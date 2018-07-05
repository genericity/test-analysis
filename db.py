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
def insert_raw(raw_student_data, raw_version_data, raw_question_data):
 	cursor = get_db().cursor()
 	query_db('insert into responses (data) values (?);', [raw_student_data], cursor = cursor)
 	session_id = cursor.lastrowid
 	# Answer/version data.
 	if raw_version_data:
 		query_db('insert into answers (session_id, data) values (?, ?);', [session_id, raw_version_data])
 	# Question text.
 	if raw_question_data:
 		query_db('insert into texts (session_id, data) values (?, ?);', [session_id, raw_question_data])

 	# Return the session id, the last dataset uploaded.
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

# Inserts or updates the selected grade boundaries into the database.
def insert_or_update_boundaries(session_id, ab, bc, cd):
 	cursor = get_db().cursor()

 	if not session_id:
 		return

 	boundaries_str = str(ab) + ',' + str(bc) + ',' + str(cd)

 	# If there are no existing rows in the database, insert.
 	if not get_grade_boundaries(session_id):
 		query_db('insert into boundaries (session_id, boundaries) values (?,?);', [session_id, boundaries_str], cursor = cursor)
 	# Otherwise, update the existing entry.
 	else:
 		query_db('update boundaries set boundaries = ? where session_id = ? limit 1;', [boundaries_str, session_id], cursor = cursor)

# Retrieves the grade boundaries from the database.
def get_grade_boundaries(session_id):
 	result = query_db('select * from boundaries where session_id = ?', [session_id], one = True)

 	if result:
	 	# Split into the three boundaries.
	 	boundaries = result['boundaries'].split(',')
	 	# Convert to numeric values and return.
	 	return [float(i) for i in boundaries]

	# Return None if there were no results.
	return None

# Inserts or updates the selected grade boundaries into the database.
def insert_or_update_subboundaries(session_id, boundaries):
 	cursor = get_db().cursor()

 	print(session_id, boundaries)

 	if not session_id:
 		return

 	boundaries_str = ','.join(list(map(str, boundaries)))
 	print (boundaries_str)

 	# If there are no existing rows in the database, insert.
 	if not get_grade_subboundaries(session_id):
 		query_db('insert into subboundaries (session_id, boundaries) values (?,?);', [session_id, boundaries_str], cursor = cursor)
 	# Otherwise, update the existing entry.
 	else:
 		query_db('update subboundaries set boundaries = ? where session_id = ? limit 1;', [boundaries_str, session_id], cursor = cursor)

# Retrieves the sub grade boundaries from the database.
def get_grade_subboundaries(session_id):
 	result = query_db('select * from subboundaries where session_id = ?', [session_id], one = True)

 	if result:
	 	# Split into the three boundaries.
	 	boundaries = result['boundaries'].split(',')
	 	# Convert to numeric values and return.
	 	return [float(i) for i in boundaries]

	# Return None if there were no results.
	return None

# Retrieves the sub grade boundaries from the database.
def delete_grade_subboundaries(session_id):
 	result = query_db('delete from subboundaries where session_id = ?', [session_id], one = True)

# Retrieves response data from the database given a session id.
def get_responses(session_id):
	result = query_db('select * from responses where ROWID = ?;', [session_id], one = True)
	return result

# Retrieves answer data from the database given a session id.
def get_answers(session_id):
	result = query_db('select * from answers where session_id = ?;', [session_id], one = True)
	return result

# Retrieves question text data from the database given a session id.
def get_texts(session_id):
	result = query_db('select * from texts where session_id = ?;', [session_id], one = True)
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