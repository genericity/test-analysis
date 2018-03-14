// Temporary script to generate fake student rows.
const amount = 100;
const students = [];
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

// Generate a fake student ID.
function fakeStudentId() {
	let text = '';
	const possible = 'abcdefghijklmnopqrstuvwxyz';

	for (let i = 0; i < 4; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text + getRandomInt(100, 999).toString();
}

for (let i = 0; i < amount; i++) {
	// Generate a fake student id and an IRT score.
	const data = [fakeStudentId(), roundToPlaces(getRandomInt(15, 60) / 10 - 3, 1)];
	// Convert the IRT score to a raw score.
	data.push(Math.round((data[1] + 3) * (100 / 6)));
	// Generate a random new score.
	if (data[2] != 100) {
		data.push(Math.min(data[2] + (getRandomInt(0, 20) - 10), 100));
	} else {
		data.push(100);
	}
	// Map the scores to grades.
	data.push(gradeMap[Math.round((data[2] - 20) / 9)]);
	data.push(gradeMap[Math.round((data[3] - 20) / 9)]);
	// Make the student row.
	const student = new StudentRow(data, i);
	students.push(student);
}

for (const student of students) {
	document.getElementById('student-body').innerHTML += student.generateRow();
}