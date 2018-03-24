studentHandler().then((students) => {
	// Generate the entire block.
	let all_students = '';
	for (const student of students) {
		all_students += student.generateRow(); 
	}	
	document.getElementById('student-body').innerHTML = all_students;
});