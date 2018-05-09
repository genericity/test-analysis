/*
* Handles uploading files.
*/
class FileHandler {
	constructor(types) {
		// Total number of required fields.
		this.required = {};
		// Total uploaded so far.
		this.requiredUploaded = {};
		// Next page.
		this.nextPage = '/questions';

		// For each set of response types.
		for (const type of types) {
			// Listen to the radio button change.
			const radio = type.radio;
			const radioButton = document.getElementById(type.radio);
			const cards = document.getElementsByClassName('upload-status');
			const fileIds = type.show;
			radioButton.onchange = () => {
				// Clear set.
				if (!this.required[radio]) {
					this.required[radio] = new Set();
				}
				if (!this.requiredUploaded[radio]) {
					this.requiredUploaded[radio] = new Set();
				}				
				
				this.disallowProgress();

				// Hide all.
				for (const element of cards) {
					element.classList.add('hidden');
				}

				// For each file input element:
				for (const fileId of fileIds) {
					const fileElement = document.getElementById(fileId.input);
					fileElement.parentElement.classList.remove('hidden');

					if (fileId.required) {
						this.required[radio].add(fileId.input)
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
							this.requiredUploaded[radio].add(fileId.input);
							// Check if the required set is a subset of the uploaded set.
							if (this.requiredUploaded[radio].isSuperset(this.required[radio])) {
								this.allowProgress();
							}
						}
					};
				}

				// Check if the required set is a subset of the uploaded set.
				if (this.requiredUploaded[radio].isSuperset(this.required[radio])) {
					this.allowProgress();
				}
			}
		}

		// Fire the events.
		document.getElementById('file-type-answer-response').checked = true;
		document.getElementById('file-type-answer-response').onchange();

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
		button.setAttribute('for', 'submit-form');
		button.href = this.nextPage;
	}

	/*
	* Disallow progress to the next page.
	*/
	disallowProgress() {
		const button = document.getElementById('next-button');
		button.classList.add('disabled-button');
		button.setAttribute('for', '');
		button.href = '#';
	}

}
