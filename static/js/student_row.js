/*
* Represents a row of student data.
*/
class StudentRow extends Row {
	/*
	* @override
	*/
	constructor(data, index) {
		super(data, index);
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
}