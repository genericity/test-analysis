// Temporary script to generate fake question rows.
const amount = 50;
const questions = [];

for (let i = 0; i < amount; i++) {
	const data = [i, '', roundToPlaces(getRandomInt(1, 10) / 10, 1), roundToPlaces(getRandomInt(15, 60) / 10 - 3, 1), roundToPlaces(getRandomInt(10, 60) / 10 - 3, 1)];
	const question = new QuestionRow(data, i);
	questions.push(question);
}

for (const question of questions) {
	document.getElementById('question-body').innerHTML += question.generateRow();
}