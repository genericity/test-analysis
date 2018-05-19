/**
* Represents a loading icon.
*/
class Spinner {
	constructor(container) {
		this.container = container;
		// Create the SVG image.
		this.img = document.createElement('img')
		this.img.src = '/static/loading.svg';
		this.img.width = 200;
		this.img.id = 'spinner';
		// Create the container for the image.
		this.imgContainer = document.createElement('div');
		this.imgContainer.id = 'spinner-container';
		this.imgContainer.appendChild(this.img);
		this.container.appendChild(this.imgContainer);
	}

	hide() {
		this.imgContainer.classList.add('hidden');
		this.container.removeChild(this.imgContainer);

		if (document.getElementById('graph-canvas')) {
			document.getElementById('graph-canvas').style.height = '900px';
		}
	}
}