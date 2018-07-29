# Represents an individual question.
class Question:
	def __init__(self, test, percentage_correct = 0, discard = False, text = '', discrimination = None, weight = None):
		# {!Test} The test containing this question.
		self.test = test
		# {string} The question text string.
		self.text = text
		# {number} The percentage of students that answered this question correctly.
		self.percentage_correct = percentage_correct
		# {boolean} If this question should be discarded from analysis.
		self.discard = (percentage_correct == 100) or (percentage_correct == 0) or discard
		# {number} The question weight, or item score.
		self.item_weight = weight
		# {number} The discrimination of the question.
		self.discrimination = discrimination

	# Retrieve the discrimination for a specific question.
	def get_discrimination(self):
		# Calculate and cache the discrimination row.
		if self.discrimination is None:
			self.test.calculate_question_stats()

		return self.discrimination

	# Retrieve the item weight for a specific question.
	def get_item_weight(self):
		# Calculate and cache the discrimination row.
		if self.item_weight is None:
			self.test.calculate_question_stats()

		return self.item_weight