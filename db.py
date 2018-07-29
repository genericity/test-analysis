import sqlite3
from flask import g

class Database:
	def __init__(self):
		self.DATABASE = 'database.db'

		def no_processing(x):
			return x

		def str_to_int_list(x):
			x = x.split(',') if x else []
			return [int(str(i)) for i in x]

		def str_to_float_list(x):
			x = x.split(',') if x else []
			return [float(str(i)) for i in x]

		def list_to_str(x):
			return ','.join(list(map(str, x))) if x else ''

		# Initialize stored instructions for handling each type of data in each table.
		self.get_processing = {
			'responses': no_processing,
			'answers': no_processing,
			'question_texts': no_processing,
			'discarded_questions': str_to_int_list,
			'boundaries': str_to_float_list,
			'subboundaries': str_to_float_list,
			'question_discriminations': str_to_float_list,
			'question_weights': str_to_float_list,
			'student_locations': str_to_float_list
		}

		self.insert_processing = {
			'responses': no_processing,
			'answers': no_processing,
			'question_texts': no_processing,
			'discarded_questions': list_to_str,
			'boundaries': list_to_str,
			'subboundaries': list_to_str,
			'question_discriminations': list_to_str,
			'question_weights': list_to_str,
			'student_locations': list_to_str
		}

	# Retrieves the current connection.
	def get_db(self):
	    database = getattr(g, '_database', None)
	    if database is None:
	        database = g._database = sqlite3.connect(self.DATABASE)
	    database.row_factory = self.make_dicts
	    return database

	# Converts a SQLite Row into a dictionary.
	def make_dicts(self, cursor, row):
		return dict((cursor.description[idx][0], value) for idx, value in enumerate(row))

	# Queries the database.
	def query_db(self, query, args = (), cursor = False, one = False):
		cursor = cursor or self.get_db().cursor()
		cursor.execute(query, args)
		results = cursor.fetchall()
		# Save changes to the database.
		self.get_db().commit()
		# Close the connection.
		cursor.close()
		return (results[0] if results else None) if one else results

	def make_question_marks(self, num):
		return ', '.join(['?'] * num)

	def expand_list(self, arr):
		return ', '.join(arr)

	# Inserts data that will never be overwritten.
	def insert(self, table, columns, arguments):
		cursor = self.get_db().cursor()

		self.query_db('insert into %s (' % table + self.expand_list(columns) + ') values (' + self.make_question_marks(len(arguments))+ ');', arguments, cursor = cursor)
		session_id = cursor.lastrowid

		# Return the session id, the last dataset written.
 		return session_id

 	# Retrieves data. Assumes that a table has only two columns: the data column (named the same as the table) and the session id column.
	def get_from(self, table, session_id, identifier = 'session_id'):
		cursor = self.get_db().cursor()

		# If the session ID is not set, return.
	 	if not session_id:
	 		return

	 	result = self.query_db('select * from %s where %s = ?' % (table, identifier), args = [session_id], one = True)

	 	if not result:
	 		return None

	 	return_dict = {}

	 	# Multiple columns.
 		for column in result:
 			if column != identifier:
 				return_dict[column] = self.get_processing[column](result[column])

 		return return_dict

 	# Inserts data. Assumes that a table has only two columns: the data column (named the same as the table) and the session id column.
	def insert_or_update_from(self, table, session_id, value):
		cursor = self.get_db().cursor()

		# If the session ID is not set, return.
	 	if not session_id:
	 		return

 		original = self.get_from(table, session_id)

	 	# This is not the first time this has been edited.
	 	if original:
	 		value = value or original[table]

	 		# Erase the previous entry.
	 		self.query_db('delete from %s where session_id = ?' % table, [session_id], one = True)

	 	# Process each one into a string.
	 	value = self.insert_processing[table](value)

 	 	self.query_db('insert into %s (session_id, %s) values (?, ?);' % (table, table), [session_id, value], cursor = cursor)


	def delete_from(self, table, session_id):
		self.query_db('update %s set %s = \'\' where session_id = ?' % (table, table), [session_id], one = True)