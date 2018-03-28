/*
* Represents a row of student data.
*/
class StudentRow extends Row {
	/*
	* @override
	*/
	constructor(data, index) {
		// Convert necessary items to numbers.
		data[1] = parseFloat(data[1]);
		data[3] = parseFloat(data[3]);
		data[4] = parseFloat(data[4]);
		data[5] = parseFloat(data[5]);

		// Make a copy of the original values.
		const original = data.slice();

		// Round some values.
		data[1] = roundToPlaces(data[1], 1);
		data[3] = roundToPlaces(data[3], 1);
		data[4] = roundToPlaces(data[4], 2);
		data[5] = roundToPlaces(data[5], 1);

		super(data, index);

		// Set variables.
		this.id = original[0];
		this.raw_percentage = original[1];
		this.analyzed_percentage = data[3];
		this.location = original[4];
		this.recommended_percentage = original[5];
	}

	/*
	* Converts a grade to a numeric value.
	* @param {string} grade The grade to convert.
	* @return {number} The numeric grade.
	*/
	gradeToNum(grade) {
		const gradeMap = {
			9: 'A+',
			8: 'A',
			7: 'A-',
			6: 'B+',
			5: 'B',
			4: 'B-',
			3: 'C+',
			2: 'C',
			1: 'C-',
			0: 'D'
		};

		return parseInt(getKeyByValue(gradeMap, grade), 10);
	}

	/*
	* @override
	*/
	status() {
		// Determine if the change to the student is good, bad, or neutral.
		const newGrade = this.data[5];
		const oldGrade = this.data[4];

		// The new grade is better than the old grade.
		if (this.gradeToNum(newGrade) > this.gradeToNum(oldGrade)) {
			return 'good';
		} else if (this.gradeToNum(newGrade) < this.gradeToNum(oldGrade)) {
			return 'poor';
		} else {
			return 'neutral';
		}
	}

	/*
	* Generates a string with the percentage correct.
	* @return {string} A string representing the percentage of correct answers.
	*/
	getPercentage() {
		return 'Raw percentage: ' + this.raw_percentage + '%';
	}
}