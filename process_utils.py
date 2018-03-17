import re

# Determines if a file has the requisite file extension(s).
def allowed_file(filename):
	ALLOWED_EXTENSIONS = set(['txt', 'csv'])
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Splits a string into chunks of size n.
def split_into_chunks(str, size):
	return re.findall('.' * size, str)