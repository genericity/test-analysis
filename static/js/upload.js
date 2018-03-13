/*
* Handles uploading files.
*/
class FileHandler {
	constructor(fileIds) {
		// Total number of required fields.
		this.required = new Set();
		// Total uploaded so far.
		this.requiredUploaded = new Set();
		// Next page.
		this.nextPage = '/questions';

		// For each file input element:
		for (const fileId of fileIds) {
			const fileElement = document.getElementById(fileId.input);

			if (fileId.required) {
				this.required.add(fileId.input)
			}

			// When a file is selected, change the text of the label.
			fileElement.onchange = () => {
				if (fileElement.value) {
					const label = document.getElementById(fileId.label);
					// Change the text from 'Choose a ___ file' to the file name.
					label.getElementsByTagName('span')[0].innerHTML = this.basename(fileElement.value);
					// Change the colour and icon to indicate a file has been selected.
					label.classList.add('file-selected');

					// Add this to the set of uploaded files.
					this.requiredUploaded.add(fileId.input);
					// Check if the required and the uploaded sets are equal in length.
					if (this.required.size <= this.requiredUploaded.size) {
						this.allowProgress();
					}
				}
			};
		}
	}

	/*
	* Retrieves the file name from a path only.
	* @param {string} path The path to find a file from, e.g. /Users/user/document.txt.
	* @return {string} The file name only, e.g. document.txt.
	*/
	basename(path) {
		return path.replace(/^.*[\\\/]/, '');
	}

	/*
	* Allow progress to the next page.
	*/
	allowProgress() {
		const button = document.getElementById('next-button');
		button.classList.remove('disabled-button');
		button.href = this.nextPage;
	}
}

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