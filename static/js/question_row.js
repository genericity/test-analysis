/*
* Represents a row of questions.
*/
class QuestionRow extends Row {
	/*
	* @override
	*/
	constructor(data, index) {
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
		const isKept = strToBool(data.pop());
		// Mark removed questions as removed.
		if (!isKept) {
			data[3] = 'Removed';
			data[4] = 'Removed';
		}

		// Ensure questions with 100% or 0% are excluded.
		if (original[2] == 100 || original[2] == 0 || original[3] < 0) {
			data[3] = 'Invalid';
			data[4] = 'Invalid';
		}

		super(data, index);
		
		// Generate a checkbox based on if this question was kept.
		this.data.push(this.generateToggle(isKept));

		// Set variables.
		this.percentageCorrect = original[2];
		this.discrimination = original[3];
		this.itemWeight = original[4];
		this.isKept = isKept;
	}

	/*
	* Generates the markup for a toggle icon.
	* @param {boolean} Whether this question was marked as kept (true) or discarded (false).
	* @return {string} The HTML representation of the toggle icon.
	*/
	generateToggle(isKept) {
		// The label for toggling the checkbox.
		const togglableLabel = '<label class="material-icons toggle" for="question-' + this.index + '">';
		const untogglableLabel = '<label class="material-icons toggle">';

		// Difficulty and invalidity checks.
		const invalidDifficulty = (this.percentageCorrect == 0 || this.percentageCorrect == 100);

		// Whether the box was checked (discard) or not.
		// If this is their first visit to the page, this is based on the status (and if it is invalid). Otherwise, it is based on the isKept value.
		let checked = true;
		if (sessionStorage.getItem('hasAnalyzedQuestions')) {
			checked = !isKept;
		} else {
			sessionStorage.setItem('hasAnalyzedQuestions', true);
			checked = (this.status() == 'poor' ? true : false);
		}
		// If the question is invalid, it is never marked as 'keep'.
		if (invalidDifficulty) {
			checked = true;
		}

		// Check the checkbox to discard it if the question is poor.
		let markup = '<input type="checkbox" ' + (checked ? 'checked' : '');
		// Add the rest of the checkbox markup and label markup.
		markup += ' name="question" value="' + this.index;
		markup += '" id="question-' + this.index;
		markup += '">';

		// Only allow toggling if this was not an invalid question.
		if (!invalidDifficulty) {
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
		if (this.percentageCorrect == 0 || this.percentageCorrect == 100 || this.discrimination < 0) {
			return 'poor';
		} else if (!this.isKept) {
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