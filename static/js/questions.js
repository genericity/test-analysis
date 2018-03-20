// Request the question data.
get('/get/questions').then((response) => {
	// Raw question data.
	const rawQuestions = response.split('\n');
	// Array of QuestionRows.
	const questions = [];

	// Convert each question to a QuestionRow.
	for (const rawQuestion of rawQuestions) {
		const split = rawQuestion.split(',');
		// Convert necessary items to numbers.
		split[0] = parseInt(split[0], 10);
		split[2] = roundToPlaces(parseFloat(split[2]), 1);
		split[3] = roundToPlaces(parseFloat(split[3]), 2);
		split[4] = roundToPlaces(parseFloat(split[4]), 2);
		// 0-indexed questions.
		split[0] += 1;
		const index = split[0];
		// Create a new QuestionRow.
		const question = new QuestionRow(split, index);
		questions.push(question);
	}

	// Generate the entire block.
	for (const question of questions) {
		document.getElementById('question-body').innerHTML += question.generateRow(); 
	}	
});