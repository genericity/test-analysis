// Initiate file upload handling.

// TODO: move this
sessionStorage.setItem('hasAnalyzedQuestions', false);
console.log(sessionStorage.getItem('hasAnalyzedQuestions'))

new FileHandler([{
		input: 'file-student-data',
		label: 'label-student-data',
		required: true,
	}, {
		input: 'file-version-data',
		label: 'label-version-data',
		required: false,
	}, {
		input: 'file-question-data',
		label: 'label-question-data',
		required: false
	},
]);