/*
* A dot-plot interface for creating dotplots using Chart.js. Handles all the chart creation. Not a true class.
*/
class DoubleDotPlot {
  /**
  * Constructor. Defines some constants, and chart data.
  * @param {!CanvasRenderingContext2D} ctx The canvas rendering context to use.
  * @param {!Object<string, !Array<number>>} data An object of array of numbers.
  * 	Each array represents a different dataset. The string acting as the key
  * 	to each dataset is the label for the dataset.
  * @options {=!Object} options An object containing options for this chart.
  */
  constructor(ctx, data, options = {}) {
	//const blue = '#64B5F6';
	//const red = '#E57373';

    this.chart = null;
    this.currentY = 50;
    this.originalData = data;

    // Default options.
    const DEFAULT_OPTIONS = {
      type: 'scatter',
      data: {
		    datasets: []
  	  },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
          padding: {
            left: 10,
            right: 20,
            top: 50,
            bottom: 30,
          }
        },
        scales: {
            xAxes: [{
              type: 'linear',
              position: 'bottom',
              display: false,
              stepSize: 1,
              id: 'x'
            }],
            yAxes: [{
              id: 'y',
              type: 'linear',
              position: 'right',
              ticks: {
              	suggestedMin: -3,
              	suggestedMax: 3,
              	fontColor: '#fff',
              	stepSize: 0.5
              },
              gridLines: {
              	drawBorder: false
              }
            }],
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

    this.options = DEFAULT_OPTIONS;

    let i = 0;
    // Convert each dataset to points on the chart.
    for (const label of Object.keys(data)) {
    	const newSet = {
    		label: label,
    		data: this.numbersToDotPlot(data[label], i),
    		//pointBackgroundColor: i ? blue : red
    	}
    	// Add to the chart.
    	this.options.data.datasets.push(newSet);
    	i++;
    }

    // Overwrite the default options with the user-selected options.
    Object.assign(this.options.options, options);

    // Set font and point radius.
    Chart.defaults.global.defaultFontFamily = 'Roboto';
    Chart.defaults.global.elements.point.radius = 5;
    Chart.defaults.global.defaultFontSize = 15;

    // Add a y-axis.
    this.addYAxis();

    // Create chart.
    this.chart = new Chart(ctx, this.options);
    }

  /*
  * Converts a list of numbers into X/Y coordinates for a scatter-chart, allowing it to be displayed as a dot-plot.
  * @param {!Array<number>} data A list of numbers.
  * @param {number=} index The position in the list this dataset is.
  * @return {!Array<Object>} An array of objects, with x and y values.
  */
  numbersToDotPlot(data, index = 0) {
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
    	// Alternate between placing points to the left and right of 0.
		const newPoint = {
			// Create a gap of four dots between the two sections.
			x: (existing[value] + 2) * Math.pow(-1, index),
			y: value
		};
		points.push(newPoint);
    }

    return points;
  }

  /*
  * Adds a y-axis to the chart.
  */
  addYAxis() {
    // Add the background for the axis labels.
    this.options.options.annotation.annotations.push({
      type: 'box',
      xScaleID: 'x',
      yScaleID: 'y',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      yMax: 3,
      yMin: -3,
      xMin: -1,
      xMax: 1,
      borderWidth: 0,
      borderColor: '#fff',
      // Draw the axis labels.
      callback: (ctx) => {
        ctx.save();

        // Set up fonts.
        ctx.font = '14px Roboto, sans-serif';
        ctx.fillStyle = '#757575';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        // Positions to draw the label at.
        const ticks = [-3, -2, -1, 0, 1, 2, 3];
        for (let i = 0; i < ticks.length; i++) {
          // Draw each label in the centre.
          this.drawAt(ctx, {
            text: ticks[i],
            x: 0,
            y: ticks[i]
          });
        }

        ctx.textAlign = 'right';
        ctx.font = '15px Roboto, sans-serif';
        ctx.fillStyle = '#424242';
        ctx.textBaseline = 'bottom';
        // Draw the hard/easy signs.
        this.drawAt(ctx, {
          text: 'Difficulty',
          x: -1,
          y: 3.5
        });
        this.drawAt(ctx, {
          text: 'Hard',
          x: -1,
          y: 3.2
        });
        ctx.textBaseline = 'top';
        this.drawAt(ctx, {
          text: 'Easy',
          x: -1,
          y: -3.2
        });

        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        // Draw the high/low performance signs.
        this.drawAt(ctx, {
          text: 'Performance',
          x: 1,
          y: 3.5
        });
        this.drawAt(ctx, {
          text: 'High',
          x: 1,
          y: 3.2
        });
        ctx.textBaseline = 'top';
        this.drawAt(ctx, {
          text: 'Low',
          x: 1,
          y: -3.2
        });

        ctx.restore();
      }
    });
  }

  /*
  * Draws text at the specified x and y coordinates on the chart.
  */
  drawAt(ctx, options) {
    // Obtain the scales.
    const yScale = this.chart.chart.scales.y;
    const xScale = this.chart.chart.scales.x;

    // Convert the chart coordinates to canvas coordinates.
    const canvasY = yScale.getPixelForValue(options.y || 0);
    const canvasX = xScale.getPixelForValue(options.x || 0);

    ctx.fillText(options.text, canvasX, canvasY);
  }
}