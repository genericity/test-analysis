let numUpTwoGrades = 0;
let numUpOneGrade = 0;
let numNeutralGrade = 0;
let numDownOneGrade = 0;
let numDownTwoGrades = 0;
let numUpTwoPercent = 0;
let numUpOnePercent = 0;
let numNeutralPercent = 0;
let numDownOnePercent = 0;
let numDownTwoPercent = 0;

const spinner = new Spinner(document.getElementById('students-table'));

studentHandler().then((students) => {
	// Generate the entire block.
	let all_students = '';
	for (const student of students) {
		// Save statistics.
		const percentageDifference = student.recommendedPercentage - student.rawPercentage;
		const gradeDifference = student.gradeToNum(student.newGrade) - student.gradeToNum(student.oldGrade);

		// Grade difference.
		if (gradeDifference >= 2) {
			numUpTwoGrades++;
		} else if (gradeDifference == 1) {
			numUpOneGrade++;
		} else if (gradeDifference == -1) {
			numDownOneGrade++;
		} else if (gradeDifference <= -2) {
			numDownTwoGrades++;
		} else {
			numNeutralGrade++;
		}

		// Percentage difference.
		if (percentageDifference >= 7.5) {
			numUpTwoPercent++;
		} else if (percentageDifference >= 2.5 && percentageDifference < 7.5) {
			numUpOnePercent++;
		} else if (percentageDifference <= -2.5 && percentageDifference > -7.5) {
			numDownOnePercent++;
		} else if (percentageDifference <= -7.5) {
			numDownTwoPercent++;
		} else {
			numNeutralPercent++;
		}
		// Generate the row.
		all_students += student.generateRow();
	}	
	document.getElementById('student-body').innerHTML = all_students;

	// Push the statistics to the page.
	document.getElementById('grade-+2').innerHTML = numUpTwoGrades;
	document.getElementById('grade-+1').innerHTML = numUpOneGrade;
	document.getElementById('grade-0').innerHTML = numNeutralGrade;
	document.getElementById('grade--1').innerHTML = numDownOneGrade;
	document.getElementById('grade--2').innerHTML = numDownTwoGrades;
	document.getElementById('percentage-+2').innerHTML = numUpTwoPercent;
	document.getElementById('percentage-+1').innerHTML = numUpOnePercent;
	document.getElementById('percentage-0').innerHTML = numNeutralPercent;
	document.getElementById('percentage--1').innerHTML = numDownOnePercent;
	document.getElementById('percentage--2').innerHTML = numDownTwoPercent;

	spinner.hide();
});