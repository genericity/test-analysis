// Request the question data.
function questionHandler() {
	return get('/get/questions').then((response) => {
		// Raw question data.
		const rawQuestions = response.split('\n');
		// Array of QuestionRows.
		const questions = [];

		// Convert each question to a QuestionRow.
		for (const rawQuestion of rawQuestions) {
			const split = rawQuestion.split(',');
			
			// 0-indexed questions.
			split[0] = parseInt(split[0], 10);
			split[0] += 1;
			// Create a new QuestionRow.
			const question = new QuestionRow(split, split[0]);
			questions.push(question);
		}

		return questions;
	});
}