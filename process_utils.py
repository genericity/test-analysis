import re

# Determines if a file has the requisite file extension(s).
def allowed_file(filename):
	ALLOWED_EXTENSIONS = set(['txt', 'csv'])
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Splits a string into chunks of size n.
def split_into_chunks(str, size):
	return re.findall('.' * size, str)

# Converts a string into an integer if possible (is not None or empty), otherwise returns 0.
def int_if_possible(str):
	# Strip of whitespace.
	str = str.strip()
	if str is None or len(str) == 0:
		return 0
	else:
		try:
			return int(str)
		except ValueError:
			return 0

# Safely escapes a string into encoded HTML characters, converting commas, <, >, etc. to safe characters.
def html_encode(str):
	str = re.sub('&', '&amp;', str)
	str = re.sub(',', '&comma;', str)
	str = re.sub('<', '&lt;', str)
	str = re.sub('>', '&gt;', str)
	str = re.sub('\'', '&apos;', str)
	str = re.sub('"', '&quot;', str)
	return str

# Returns the mean for an array of numbers.
def mean(numbers):
	return float(sum(numbers)) / max(len(numbers), 1)

# Returns the median for an array of numbers.
def median(numbers):
	n = len(numbers)
	if n < 1:
		return None
	if n % 2 == 1:
		return sorted(numbers)[n // 2]
	else:
		return sum(sorted(numbers)[(n // 2 - 1):(n // 2 + 1)]) / 2.0