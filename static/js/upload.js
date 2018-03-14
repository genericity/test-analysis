// Initiate file upload handling.

new FileHandler([{
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
	},
]);