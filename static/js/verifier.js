/*
* Handles file verification.
*/
class Verifier {
	constructor() {
	}

	getFile(fileElement, callback) {
		try {
			const file = fileElement.files[0];
			let contents = "";

			// Ensure there is a file.
			if (file) {
				// Read the file.
				const reader = new FileReader();
				reader.readAsText(file, 'UTF-8');
				reader.onload = (e) => {
					callback(this, e.target.result, fileElement);
				}
				reader.onerror = (e) => {
					console.log('An error occurred reading this file.', e);
				}
			}
		} catch (exception) {
			// Some error occurred. Probably IE which does not support reading.
			return true;
		}
	}

	verifyFile(fileElement, fileType) {
		this.getLabel(fileElement).classList.remove('incorrect');
		if (fileType == 'csv') {
			this.getFile(fileElement, this.verifyCsv);
		} else if (fileType == 'exam') {
			this.getFile(fileElement, this.verifyExam);
		} else if (fileType == 'answerkey') {
			this.getFile(fileElement, this.verifyAnswerKey);
		}
	}

	verifyCsv(self, fileContents, fileElement) {
		try {
			fileContents = fileContents.split('\n');
			for (const line of fileContents) {
				// Verify each line is a CSV line.
				const splitLine = line.split(',');
				for (const character of splitLine) {
					if (character != '1' && character != '0') {
						throw 'Not a CSV file.';
					}
				}
			}
		} catch (exception) {
			self.falsify(fileElement, 'CSV');
		}
	}

	verifyExam(self, fileContents, fileElement) {
		try {
			fileContents = fileContents.split('\n');
			for (const line of fileContents) {
				// Verify each line is an exam response line.
				// Verify ID is numbers only.
				const numbersOnly = /^[\d\s]+$/;
				const alphaNumeric = /^[a-z0-9\s]+$/i;
				if (!numbersOnly.test(line.slice(2, 11))) {
					throw 'Not an exam office format file: ';
				}
				// Name.
				if (!alphaNumeric.test(line.slice(12, 25))) {
					throw 'Not an exam office format file';
				}
				if (!alphaNumeric.test(line.slice(25, 33))) {
					throw 'Not an exam office format file';
				}
				// Version number.
				if (!numbersOnly.test(line.slice(33, 44))) {
					throw 'Not an exam office format file';
				}
				// Response.
				if (!numbersOnly.test((line.slice(45, line.length - 1)))) {
					throw 'Not an exam office format file';
				}
			}
		} catch (exception) {
			self.falsify(fileElement, 'student response');
		}
	}

	verifyAnswerKey(self, fileContents, fileElement) {
		try {
			const numbersOnly = /^[\d\s]+$/;
			const alphaNumeric = /^[a-z0-9\s]+$/i;

			fileContents = fileContents.split('\n');
			const header = fileContents.shift();

			const headerSplit = header.split('\t');
			for (const version of headerSplit) {
				if (!alphaNumeric.test(version)) {
					throw 'Not an answer key format file';
				}
			}
			for (const i in fileContents) {
				const line = fileContents[i];
				// Verify each line is an answer key line.
				const lineSplit = line.split('\t');
				for (const answer of lineSplit) {
					// Not the last line and not a number.
					if (!numbersOnly.test(answer) && i != fileContents.length - 1) {
						throw 'Not an answer key format file';
					}
				}
			}
		} catch (exception) {
			self.falsify(fileElement, 'answer key');
		}
	}

	falsify(fileElement, fileType) {
		const label = this.getLabel(fileElement);
		label.classList.add('incorrect');
		label.getElementsByTagName('span')[0].innerHTML += ' is not a valid ' + fileType + ' file.';
	}

	getLabel(fileElement) {
		return fileElement.parentElement.getElementsByTagName('label')[0];
	}


}