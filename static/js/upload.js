// Initiate file upload handling.

// TODO: move this
sessionStorage.setItem('hasAnalyzedQuestions', false);

new FileHandler([
	{
		'radio': 'file-type-prescored',
		'show': [{
			input: 'file-prescored-data',
			label: 'label-prescored-data',
			required: true,
			verify: 'csv'
		}, {
			input: 'file-question-data',
			label: 'label-question-data',
			required: false,
			verify: 'text'
		}]
	},
	{
		'radio': 'file-type-answer-response',
		'show': [{
			input: 'file-student-data',
			label: 'label-student-data',
			required: true,
			verify: 'exam'
		}, {
			input: 'file-version-data',
			label: 'label-version-data',
			required: true,
			verify: 'answerkey'
		}, {
			input: 'file-question-data',
			label: 'label-question-data',
			required: false,
			verify: 'text'
		}]
	},
	{
		'radio': 'file-type-other',
		'show':[]
	}
]);