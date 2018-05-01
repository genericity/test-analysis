/*
* Represents a row of questions.
*/
class QuestionRow extends Row {
	/*
	* @override
	*/
	constructor(data, index) {
		let removed = false;
		let invalidDifficulty = false;
		let notRecommended = false;

		// Convert necessary items to numbers.
		data[0] = parseInt(data[0], 10);
		data[2] = parseFloat(data[2]);
		data[3] = parseFloat(data[3]);
		data[4] = parseFloat(data[4]);

		// Make a copy of the original values.
		const original = data.slice();

		// Round some values.
		data[2] = roundToPlaces(data[2], 1);
		data[3] = roundToPlaces(data[3], 2);
		data[4] = roundToPlaces(data[4], 2);

		// Check if this question was kept or not.
		// Mark removed questions as removed.
		if (!strToBool(data.pop())) {
			data[3] = 'Removed';
			data[4] = 'Removed';
			removed = true;
		}

		// Ensure questions with 100% or 0% are excluded.
		if (original[2] == 100 || original[2] == 0) {
			data[3] = 'Invalid';
			data[4] = 'Invalid';
			invalidDifficulty = true;
		}

		super(data, index);

		// Set variables.
		this.percentageCorrect = original[2];
		this.discrimination = original[3];
		this.itemWeight = original[4];

		// Difficulty and invalidity checks.
		this.invalidDifficulty = invalidDifficulty;
		this.notRecommended = notRecommended;
		this.removed = removed;

		// Generate a checkbox based on if this question was kept.
		this.data.push(this.generateToggle(this.removed));

		if (this.discrimination < 0) {
			this.notRecommended = true;
		}

		if (this.percentageCorrect == 0 || this.percentageCorrect == 100) {
			this.invalidDifficulty = true;
		}
	}

	/*
	* Generates the markup for a toggle icon.
	* @param {boolean} Whether this question was marked as kept (true) or discarded (false).
	* @return {string} The HTML representation of the toggle icon.
	*/
	generateToggle(removed) {
		// The label for toggling the checkbox.
		const togglableLabel = '<label class="material-icons toggle" for="question-' + this.index + '">';
		const untogglableLabel = '<label class="material-icons toggle">';

		// Whether the box was checked (discard) or not.
		// If this is their first visit to the page, this is based on the status (and if it is invalid). Otherwise, it is based on the isKept value.
		let checked = false;
		if (sessionStorage.getItem('hasAnalyzedQuestions') == 'true') {
			checked = removed;
		} else {
			sessionStorage.setItem('hasAnalyzedQuestions', true);
			checked = (this.invalidDifficulty || this.notRecommended ? true : false);
		}

		// If the question is invalid, it is never marked as 'keep'.
		if (this.invalidDifficulty) {
			checked = true;
		}

		// Check the checkbox to discard it if the question is poor.
		let markup = '<input type="checkbox" ' + (checked ? 'checked' : '');
		// Add the rest of the checkbox markup and label markup.
		markup += ' name="question" value="' + this.index;
		markup += '" id="question-' + this.index;
		markup += '">';

		// Only allow toggling if this was not an invalid question.
		if (!this.invalidDifficulty) {
			markup += togglableLabel;
		} else {
			markup += untogglableLabel;
		}

		return markup;
	}

	/*
	* @override
	*/
	status() {
		// Determine if a question is good, bad, or neutral.
		if (this.invalidDifficulty || this.notRecommended) {
			return 'poor';
		} else if (this.removed) {
			return 'removed';
		} else {
			return 'neutral';
		}
	}

	/*
	* Generates a string with the percentage correct.
	* @return {string} A string representing the percentage of correct students answering this question.
	*/
	getPercentage() {
		return roundToPlaces(this.percentageCorrect, 2) + '% correct';
	}
}