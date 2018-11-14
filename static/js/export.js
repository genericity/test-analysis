class Exporter {
	constructor() {
		this.data = [{
			url: '/get/students',
			header: 'data:text/html,Student ID,Raw percentage,Raw grade,Analyzed percentage,Analyzed location,Recommended percentage,Recommended grade\n',
			button: document.getElementById('export-student-summary-button'),
			sizeText: document.getElementById('export-student-summary-information').getElementsByClassName('export-subtext')[0],
			filename: document.getElementById('export-student-summary-information').getElementsByClassName('export-name')[0].innerHTML,
			callback: function(response) {return '';}
		}, {
			url: '/get/student_scores',
			header: 'data:text/html,Student ID,',
			button: document.getElementById('export-student-score-button'),
			sizeText: document.getElementById('export-student-score-information').getElementsByClassName('export-subtext')[0],
			filename: document.getElementById('export-student-score-information').getElementsByClassName('export-name')[0].innerHTML,
			callback: function(response) {
				const lines = response.split('\n');
				const firstline = lines[0];
				const answers = firstline.split(',');
				let head = new Array(answers.length - 1);
				for (let i = 0; i < answers.length - 1; i++) {
					head[i] = 'Q' + (i + 1);
				}

				return head.join(',') + '\r\n';
			}
		}, {
			url: '/get/questions/export',
			header: 'data:text/html,Question number,Question text,Percentage correct,Discrimination,Item weight,Kept\n',
			button: document.getElementById('export-question-summary-button'),
			sizeText: document.getElementById('export-question-summary-information').getElementsByClassName('export-subtext')[0],
			filename: document.getElementById('export-question-summary-information').getElementsByClassName('export-name')[0].innerHTML,
			callback: function(response) {return '';}
		}];
	}

	export() {
		for (const format of this.data) {
			// Request the data.
			get(format.url).then((response) => {
				response = response.split('\n');
				response = response.join('\r\n');
				// Retrieve the size of the download.
				const size = Utils.bytesToSize(response.length);
				// Display the size.
				format.sizeText.innerHTML = size.toLowerCase();
				// Raw student data.
				Utils.downloadLink(format.button, format.header + encodeURIComponent(format.callback(response) + response), format.filename);
			});
		}
	}
}

const exporter = new Exporter();
exporter.export();