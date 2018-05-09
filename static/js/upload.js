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
		}, {
			input: 'file-question-data',
			label: 'label-question-data',
			required: false
		}]
	},
	{
		'radio': 'file-type-answer-response',
		'show': [{
			input: 'file-student-data',
			label: 'label-student-data',
			required: true,
		}, {
			input: 'file-version-data',
			label: 'label-version-data',
			required: true,
		}, {
			input: 'file-question-data',
			label: 'label-question-data',
			required: false
		}]
	},
	{
		'radio': 'file-type-other',
		'show':[]
	}
]);