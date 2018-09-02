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

    this.chart = null;
    this.currentY = 50;
    this.originalData = data;
    this.yMin = 0;
    this.yMax = 0;
    this.xMax = 0;
    this.ctx = ctx;

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
            left: 65,
            right: 20,
            top: 70,
            bottom: 50,
          }
        },
        scales: {
            xAxes: [{
              type: 'linear',
              position: 'bottom',
              id: 'x',
              display: false
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

    let yMin = 0;
    let yMax = 0;
    let pointWidth = 0;
    let i = 0;
    // Two loops. First to find the mode (this one), then to actually set the datasets.
    // This is because the width of the axis is needed to set the positions of the data points.
    for (const label of Object.keys(data)) {
      // Count how many points across this will be at widest.
      // Add it to the count of points.
      pointWidth += Utils.modeCount(data[label]);
    }

    // Width of the chart in terms of numerical points.
    const axisPixelWidth = 80;
    const width = this.findAxisWidth(axisPixelWidth, pointWidth);

    // Convert each dataset to points on the chart.
    for (const label of Object.keys(data)) {
      const newSet = {
        label: label,
        data: this.numbersToDotPlot(data[label], i, width),
      }
      // Add to the chart.
      this.options.data.datasets.push(newSet);

      // Update the minimum and maximum y values.
      const dataMin = Utils.arrayMin(data[label]);
      if (dataMin < yMin) {
        yMin = dataMin;
      }
      const dataMax = Utils.arrayMax(data[label]);
      if (dataMax > yMax) {
        yMax = dataMax;
      }

      i++;
    }

    // Overwrite the default options with the user-selected options.
    Object.assign(this.options.options, options);

    // Set font and point radius.
    Chart.defaults.global.defaultFontFamily = 'Roboto';
    Chart.defaults.global.elements.point.radius = 5;
    Chart.defaults.global.defaultFontSize = 15;

    // Add a y-axis.
    this.addYAxis(yMin, yMax, width);

    // Add a box to hide the students until it's clicked on.
    this.studentHider = new StudentHider(yMin, yMax, width, this.xMax, this);

    // Create chart.
    this.chart = new Chart(ctx, this.options);

    this.studentHider.show();
    }

  /*
  * Finds the numerical width of the axis given the width it needs to be in pixels.
  * Takes into accounts how many points the graph will be.
  * @param {number} pixels How many pixels the axis will be across.
  * @param {number} The number of points stretching across the graph at its widest.
  * @return {number} The number of points, numerically, the axis needs to be to be the specified number of pixels.
  */
  findAxisWidth(pixels, points) {
    // Width of the canvas.
    const canvasWidth = this.ctx.canvas.parentElement.clientWidth;
    // See documentation for explanation of this algorithm.
    return (pixels * points) / (canvasWidth - pixels);
  }

  /*
  * Converts a list of numbers into X/Y coordinates for a scatter-chart, allowing it to be displayed as a dot-plot.
  * @param {!Array<number>} data A list of numbers.
  * @param {number=} index The position in the list this dataset is.
  * @return {!Array<Object>} An array of objects, with x and y values.
  */
  numbersToDotPlot(data, index, width) {
	let points = [];

	// Keep track of the existing datapoints already with this value.
	// Whenever a value is added, the counter for the number of datapoints with this value is incremented.
	let existing = {};

    for (const value of data) {
      if (isNaN(value)) {
        // Insert a placeholder.
        points.push({});
        continue;
      }
    	if (existing[value] != undefined) {
    		// Increment the existing counter.
    		existing[value]++;
    	} else {
    		// Initialize the counter as it hadn't been seen before.
    		existing[value] = 0;
    	}

      const newX = (existing[value] + (width * 1.5) / 2) * Math.pow(-1, index + 1);

      if (newX > this.xMax) {
        this.xMax = newX;
      }

    	// Create a new point.
    	// Alternate between placing points to the left and right of 0.
		  const newPoint = {
  			// Create a gap of dots between the two sections.
  			x: newX,
  			y: value
  		};
  		points.push(newPoint);
    }

    return points;
  }

  /*
  * Finds the step size for the axis.
  */
  findAxisStepSize(yMin, yMax) {
    let stepSize = 1;
    // Positions to draw the label at.
    if (yMax - yMin < 20) {
      stepSize = 1;
    } else if (yMax - yMin < 50) {
      // If there are too many things, draw every 5 instead.
      stepSize = 5;
    } else if (yMax - yMin < 100) {
      // If there are even more things, draw every 10 instead.
      stepSize = 10;
    } else {
      // Draw every 50.
      stepSize = 50;
    }

    return stepSize;
  }

  /*
  * Adds a y-axis to the chart.
  * yMin, yMax are in terms of the numbers on the axis.
  * Width is in terms of the numerical dimensions of the chart (not pixels).
  */
  addYAxis(yMin, yMax, width) {
    yMin = Math.min(yMin, -3) || -3;
    yMax = Math.max(yMax, 3) || 3;

    let stepSize = this.findAxisStepSize(yMin, yMax);

    yMin = Utils.roundTo(yMin, stepSize);
    yMax = Utils.roundTo(yMax, stepSize);

    this.yMin = yMin;
    this.yMax = yMax;

    let xMin = 0 - (width / 2);
    let xMax = 0 + (width / 2);

    // Add the background for the axis labels.
    this.options.options.annotation.annotations.push({
      type: 'box',
      xScaleID: 'x',
      yScaleID: 'y',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      yMax: yMax,
      yMin: yMin,
      xMin: xMin,
      xMax: xMax,
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

        const ticks = Utils.generateRange(yMin, yMax, stepSize);
        
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
          x: xMin,
          y: yMax,
          // Offset from the canvas coordinate in pixels.
          offsetX: 0,
          offsetY: -30
        });
        this.drawAt(ctx, {
          text: 'Hard',
          x: xMin,
          y: yMax,
          offsetX: 0,
          offsetY: -15
        });
        ctx.textBaseline = 'top';
        this.drawAt(ctx, {
          text: 'Easy',
          x: xMin,
          y: yMin,
          offsetX: 0,
          offsetY: 0
        });

        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        // Draw the high/low performance signs.
        this.drawAt(ctx, {
          text: 'Performance',
          x: xMax,
          y: yMax,
          offsetX: 0,
          offsetY: -30
        });
        this.drawAt(ctx, {
          text: 'High',
          x: xMax,
          y: yMax,
          offsetX: 0,
          offsetY: -15
        });
        ctx.textBaseline = 'top';
        this.drawAt(ctx, {
          text: 'Low',
          x: xMax,
          y: yMin,
          offsetX: 0,
          offsetY: 0
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
    const canvasY = yScale.getPixelForValue(options.y || 0) + (options.offsetY || 0);
    const canvasX = xScale.getPixelForValue(options.x || 0) + (options.offsetX || 0);

    ctx.fillText(options.text, canvasX, canvasY);
  }

  /*
  * Returns the conversion factor between scales and pixels - i.e. factor * pixels desired = scale value.
  */
  getXScaleFactor() {
    if (!this.chart) {
      return 0.05;
    }
    const xScale = this.chart.chart.scales.x;

    // Calculate the distance between points at 0 and 20.
    const distance = 20;
    const point0 = xScale.getPixelForValue(0);
    const point20 = xScale.getPixelForValue(distance);
    const pixels = point20 - point0;
    return distance / pixels;
  }
}