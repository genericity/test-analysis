/*
* A dot-plot interface for creating dotplots using Chart.js. Handles all the chart creation. Not a true class.
*/
class DotPlot {
  /**
  * Constructor. Defines some constants, and chart data.
  * @param {!CanvasRenderingContext2D} ctx The canvas rendering context to use.
  * @param {!Object<string, !Array<number>>} data An object of array of numbers.
  * 	Each array represents a different dataset. The string acting as the key
  * 	to each dataset is the label for the dataset.
  * @options {=!Object} options An object containing options for this chart.
  */
  constructor(ctx, data, options = {}) {
	const blue = '#64B5F6';

    this.chart = null;
    this.currentY = 50;
    this.originalData = data;

    // Default options.
    this.options = {
      type: 'scatter',
      options: {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
          padding: {
            left: 50,
            right: 50
          }
        },
        title: {
          display: true,
          position: 'top',
          fontSize: 32,
          fontColor: '#424242',
          padding: 24,
          text: 'Title',
        },
        scales: {
            xAxes: [{
              type: 'linear',
              position: 'bottom',
              display: false,
              stepSize: 1
            }],
            yAxes: [{
              id: 'y'
            }],
            ticks: {
              fontSize: 14,
            }
        },
        elements: {
          // Hide the line so that the scatterplot is not filled.
          line: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0,
            borderColor: 'rgba(0, 0, 0, 0)',
            fill: false
          }
        },
        legend: {
          display: false,
        },
      },
    };

    // Data in chart-friendly format.
    this.options.data = {
    	datasets: []
    };

    // Convert each dataset to points on the chart.
    for (const label of Object.keys(data)) {
    	const newSet = {
    		label: label,
    		data: this.numbersToDotPlot(data[label]),
    		pointBackgroundColor: blue
    	}
    	// Add to the chart.
    	this.options.data.datasets.push(newSet);
    }

    // Overwrite the default options with the user-selected options.
    Object.assign(this.options, options);

    // Set font and point radius.
    Chart.defaults.global.defaultFontFamily = 'Roboto';
    Chart.defaults.global.elements.point.radius = 5;
    Chart.defaults.global.defaultFontSize = 15;

    // Create chart.
    this.chart = new Chart(ctx, this.options);
    }

  /*
  * Converts a list of numbers into X/Y coordinates for a scatter-chart, allowing it to be displayed as a dot-plot.
  * @param {!Array<number>} data A list of numbers.
  * @return {!Array<Object>} An array of objects, with x and y values.
  */
  numbersToDotPlot(data) {
	let points = [];

	// Keep track of the existing datapoints already with this value.
	// Whenever a value is added, the counter for the number of datapoints with this value is incremented.
	let existing = {};

    for (const value of data) {
    	if (existing[value] != undefined) {
    		// Increment the existing counter.
    		existing[value]++;
    	} else {
    		// Initialize the counter as it hadn't been seen before.
    		existing[value] = 0;
    	}

    	// Create a new point.
		const newPoint = {
			x: existing[value],
			y: value
		};
		points.push(newPoint);
    }

    return points;
  }
}