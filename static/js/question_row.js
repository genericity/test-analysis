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
		data[2] = roundToPlaces(parseFloat(data[2]), 1);
		data[3] = roundToPlaces(parseFloat(data[3]), 2);
		data[4] = roundToPlaces(parseFloat(data[4]), 2);

		super(data, index);
		this.data.push(this.generateToggle());

		// Set variables.
		this.percentage_correct = data[2];
		this.discrimination = data[3];
		this.item_weight = data[4];
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
		const weight = this.data[4];
		if (difficulty == 0 || difficulty == 100 || discrimination < 0) {
			return 'poor';
		} else {
			return 'neutral'
		}
	}
}