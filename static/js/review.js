// Request the student data.
get('/get/students').then((response) => {
	// Raw student data.
	const rawStudents = response.split('\n');
	// Array of StudentRows.
	const students = [];

	// Index.
	let i = 1
	// Convert each question to a QuestionRow.
	for (const rawStudent of rawStudents) {
		const split = rawStudent.split(',');

		// Convert necessary items to numbers.
		split[0] = parseInt(split[0], 10);
		split[1] = roundToPlaces(parseFloat(split[1]), 1);
		split[3] = roundToPlaces(parseFloat(split[3]), 1);
		split[5] = roundToPlaces(parseFloat(split[5]), 1);
		const index = i;

		// Create a new StudentRow.
		const student = new StudentRow(split, index);
		students.push(student);

		i += 1
	}

	// Generate the entire block.
	let all_students = '';
	for (const student of students) {
		all_students += student.generateRow(); 
	}	
	document.getElementById('student-body').innerHTML = all_students;
});