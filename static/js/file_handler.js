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

		const cards = document.getElementsByClassName('upload-status');
		this.enableDragAndDrop(cards);
		
		// For each set of response types.
		for (const type of types) {
			// Listen to the radio button change.
			const radioType = type['radio'];
			const radioButton = document.getElementById(radioType);
			
			const fileIds = type.show;

			// When the set is selected.
			radioButton.onchange = () => {
				// Clear set.
				if (!this.required[radioType]) {
					this.required[radioType] = new Set();
				}
				if (!this.requiredUploaded[radioType]) {
					this.requiredUploaded[radioType] = new Set();
				}				
				
				this.disallowProgress();

				// Hide all.
				for (const ele of cards) {
					ele.classList.add('hidden');
				}

				// For each file input element:
				for (const fileId of fileIds) {
					const fileElement = document.getElementById(fileId.input);
					fileElement.parentElement.classList.remove('hidden');

					if (fileId.required) {
						this.required[radioType].add(fileId.input)
					}

					// When a file is selected, change the text of the label.
					fileElement.onchange = () => {
						if (fileElement.value) {
							const label = document.getElementById(fileId.label);
							// Change the text from 'Choose a ___ file' to the file name.
							label.getElementsByTagName('span')[0].innerHTML = this.basename(fileElement.value);
							// Change the colour and icon to indicate a file has been selected.
							label.classList.add('file-selected');

							// Verify this is the correct format.
							if (fileId.verify) {
								const verifier = new Verifier();
								verifier.verifyFile(fileElement, fileId.verify);
							}

							// Add this to the set of uploaded files.
							this.requiredUploaded[radioType].add(fileId.input);
							// Check if the required set is a subset of the uploaded set.
							if (this.requiredUploaded[radioType].isSuperset(this.required[radioType])) {
								this.allowProgress();
							}
						}
					};
				}

				// Check if the required set is a subset of the uploaded set.
				if (this.requiredUploaded[radioType].isSuperset(this.required[radioType])) {
					this.allowProgress();
				}
			}
		}

		// Fire the events when the page loads to change the selected type to the prescored CSV.
		document.getElementById('file-type-prescored').checked = true;
		document.getElementById('file-type-prescored').onchange();
	}

	/*
	* Enables drag and drop file uploading if possible.
	* @param {Array<!Element>} cards The array of elements to have drag events for.
	*/
	enableDragAndDrop(cards) {
		// Enable drag and drop for all the cards if possible / supported.
		if (this.dragAndDropSupported()) {
			for (const ele of cards) {
				// Style it differently by showing the drag and drop text and adding an outline.
				ele.classList.add('drag-and-drop');

				const stopPropagation = function(e) {
					e.preventDefault();
    				e.stopPropagation();
				}
				// Stop the page from redirecting on drag/drop.
				ele.addEventListener('drag', stopPropagation);
				ele.addEventListener('dragstart', stopPropagation);
				ele.addEventListener('dragend', stopPropagation);
				ele.addEventListener('dragover', stopPropagation);
				ele.addEventListener('dragenter', stopPropagation);
				ele.addEventListener('dragleave', stopPropagation);
				ele.addEventListener('drop', stopPropagation);

				// Have visual states added when hovering over the label.
				const addVisualState = function(e) {
					ele.classList.add('drag-over');
				}
				ele.addEventListener('dragover', addVisualState);
				ele.addEventListener('dragenter', addVisualState);

				// Remove visual states added when not hovering over the label.
				const removeVisualState = function(e) {
					ele.classList.remove('drag-over');
				}
				ele.addEventListener('dragend', removeVisualState);
				ele.addEventListener('dragleave', removeVisualState);
				ele.addEventListener('drop', removeVisualState);

				// Handle the dropped files.
				const handleDrop = function(e) {
					// Get the file input element.
					const fileInput = ele.getElementsByTagName('input')[0];
					// Set its files to the uploaded files.
					fileInput.files = e.dataTransfer.files;
                    fileInput.onchange();
                    
				}
				ele.addEventListener('drop', handleDrop);
			}
		}
	}

	/*
	* Checks if advanced drag and drop file uploading is supported by the browser.
	* @return {boolean} True if drag and drop is supported, false otherwise.
	*/
	dragAndDropSupported() {
		const div = document.createElement('div');
		const supported = (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FileReader' in window;
        
		return supported;
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
		const button_ = document.getElementById('next-button');
		button_.classList.remove('disabled-button');
		button_.setAttribute('for', 'submit-form');
		button_.href = this.nextPage;
	}

	/*
	* Disallow progress to the next page.
	*/
	disallowProgress() {
		const button_ = document.getElementById('next-button');
		button_.classList.add('disabled-button');
		button_.setAttribute('for', '');
		button_.href = '#';
	}

}
