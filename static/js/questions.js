questionHandler().then((questions) => {
	// Generate the entire block.
	let all_questions = '';
	for (const question of questions) {
		all_questions += question.generateRow(); 
	}	
	document.getElementById('question-body').innerHTML = all_questions;
});