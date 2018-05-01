// Request the student data.
function studentHandler() {
	return get('/get/students').then((response) => {
		// Raw student data.
		const rawStudents = response.split('\n');
		// Array of StudentRows.
		const students = [];

		// Index.
		let i = 1
		// Convert each question to a QuestionRow.
		for (const rawStudent of rawStudents) {
			const split = rawStudent.split(',');
			const index = i;

			// Create a new StudentRow.
			const student = new StudentRow(split, index);
			students.push(student);

			i += 1
		}
		return students;
	});
}