// Request the student data.
get('/get/students').then((response) => {
	const header = 'data:text/html,Student ID,Raw percentage,Raw grade,Analyzed percentage,Analyzed location,Recommended percentage,Recommended grade\n';
	// Retrieve the size of the download.
	const size = Utils.bytesToSize(response.length);
	const sizeText = document.getElementById('export-subtext');
	// Display the size.
	sizeText.innerHTML = size.toLowerCase();
	const downloadButton = document.getElementById('export-button');
	// Raw student data.
	Utils.downloadLink(downloadButton, header + response, 'data.csv');
});
