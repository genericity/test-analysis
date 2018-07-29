class StudentHider {
  /**
  * Constructor. Defines some constants.
  */
  constructor(yMin, yMax, axisWidth, xMax, chart) {
  	this.yMax = yMax;
  	this.yMin = yMin;
  	this.xMin = axisWidth / 2;
  	// As this would only come up to the middle of the dot at the longest position, adding 1 is necessary to hide the whole dot.
  	this.xMax = xMax + 1;
  	this.id = 'studentHider';

  	// Button to show the hider.
  	this.button = document.getElementById('student-hider-button');
  	this.buttonShowStudents = true;
  	this.buttonStateData = {
  		1: {
  			'icon': 'visibility',
  			'text': 'Show students'
  		},
  		0: {
  			'icon': 'visibility_off',
  			'text': 'Hide students'
  		}
  	};
  	this.button.onclick = (event) => {
  		if (this.buttonShowStudents) {
  			// this.hide() hides the hider, showing the students.
  			this.hide();
  		} else {
  			this.show();
  		}
  		// Convert the button to the other state.
  		this.buttonShowStudents = !this.buttonShowStudents;
  		const asInteger = this.buttonShowStudents * 1;
  		this.button.getElementsByClassName('button-text')[0].innerHTML = this.buttonStateData[asInteger]['text']
  		this.button.getElementsByClassName('button-icon')[0].innerHTML = this.buttonStateData[asInteger]['icon']
  	};

  	const horizontalCenter = (this.xMin + this.xMax) / 2;
	const verticalCenter = (this.yMin + this.yMax) / 2;

  	this.dotPlot = chart;
  	this.annotation = {
		type: 'box',
		id: this.id,
		xScaleID: 'x',
		yScaleID: 'y',
		backgroundColor: 'rgba(245, 245, 245, 1)',
		yMax: this.yMax,
		yMin: this.yMin,
		xMin: this.xMin,
		xMax: this.xMax,
		borderWidth: 0,
		// Draw the large callout.
		callback: (ctx) => {
			ctx.save();

			// Set up fonts.
			ctx.font = '24px Roboto, sans-serif';
			ctx.fillStyle = '#666666';
			ctx.textBaseline = 'middle';
			ctx.textAlign = 'center';

			const verticalRange = (this.yMax - this.yMin) / 2;

			// Draw the informational text in the center.
			this.dotPlot.drawAt(ctx, {
			  text: 'Your grading decisions should be',
			  x: horizontalCenter,
			  y: verticalCenter + (verticalRange / 5 * 2),
			});
			this.dotPlot.drawAt(ctx, {
			  text: 'based on standards (the questions)',
			  x: horizontalCenter,
			  y: verticalCenter + (verticalRange / 5 * 1),
			});
			this.dotPlot.drawAt(ctx, {
			  text: 'and not the distribution of the students.',
			  x: horizontalCenter,
			  y: verticalCenter,
			});
			this.dotPlot.drawAt(ctx, {
			  text: 'However, if you would like to see',
			  x: horizontalCenter,
			  y: verticalCenter - (verticalRange / 5 * 1),
			});
			this.dotPlot.drawAt(ctx, {
			  text: 'the students, click here.',
			  x: horizontalCenter,
			  y: verticalCenter - (verticalRange / 5 * 2),
			});

			ctx.restore();
		},
		onMousedown: (event) => {
        	this.hide();
      	}
	};
  }

  /**
  * Shows the student hider, obscuring view of the students.
  */
  show() {
  	// Check if a chart has already been created.
  	if (this.dotPlot.chart) {
  		// Add the hider to the chart.
  		this.dotPlot.chart.options.annotation.annotations.push(this.annotation);
  		this.dotPlot.chart.update();
  		this.button.classList.remove('hidden');
  	} else {
  		this.dotPlot.options.options.annotation.annotations.push(this.annotation);
  	}
  }

  /**
  * Hide the student hider, allowing view of the students.
  */
  hide() {
  	// Not applicable if there is no chart.
  	if (!this.dotPlot.chart) {
  		return;
  	}
  	this.hideAnnotation(this.id);
  	this.dotPlot.chart.update();
  }

  /**
  * Hide the student hider, allowing view of the students.
  */
  hideAnnotation(id) {
  // Go through all the annotations in the chart.
  	for(let i = 0; i <= this.dotPlot.chart.options.annotation.annotations.length; i++) {
  		const annotation = this.dotPlot.chart.options.annotation.annotations[i];
  		// If this is the annotation we have:
  		if (annotation.id == id) {
  			// Remove it and update the chart.
  			this.dotPlot.chart.chart.options.annotation.annotations.splice(i, i);
  			this.dotPlot.chart.update();
  			break;
  		}
  	}
  }

}