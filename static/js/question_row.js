/*
* Represents a row of questions.
*/
class QuestionRow extends Row {
	/*
	* @override
	*/
	constructor(data, index) {
		super(data, index);
		this.data.push(this.generateToggle());
		this.data[4] = capitalizeFirstLetter(this.status());
	}

	/*
	* Generates the markup for a toggle icon.
	* @return {string} The HTML representation of the toggle icon.
	*/
	generateToggle() {
		// Check the checkbox to discard it if the question is poor.
		let markup = '<input type="checkbox" ' + (this.status() == 'poor' ? 'checked' : '');
		// Add the rest of the checkbox markup and label markup.
		markup += ' name="question-' + this.index;
		markup += '" id="question-' + this.index;
		markup += '"><label class="material-icons toggle" for="question-' + this.index + '">';
		return markup;
	}

	/*
	* @override
	*/
	status() {
		// Determine if a question is good, bad, or neutral. This is a fake algorithm.
		const difficulty = this.data[2];
		const discrimination = this.data[3];
		const irt = this.data[5];
		if (irt < -1) {
			return 'poor';
		} else if (irt > 1) {
			return 'good';
		} else {
			return 'neutral';
		}
	}
}