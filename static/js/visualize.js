class ChartState {
  /**
  * Constructor. Defines some constants.
  */
  constructor() {
    this.MIN = -5;
    this.MAX = 5;
    this.MIN_POINTS = 3;
    this.MAX_POINTS = 80;
    this.chart = null;
    this.currentY = 50;
  }

  /**
  * Generates a random integer between min and max.
  */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
  * Generates a list of colours - points above the y value are red and points below are blue.
  */
  generateColours(data, y) {
    this.currentY = y;

    const blue = '#64B5F6';
    const red = '#E57373';

    let colours = [];
    for (const point of data) {
      if (point.y <= y) {
        colours.push(blue);
      } else {
        colours.push(red);
      }
    }
    return colours;
  }

  /**
  * Generates a specified amount of fake dotplot data.
  * @param {number} amount The amount of data points to generate.
  */
  generateData(amount) {
    const data = [];
    for (let i = 0; i < amount; i++) {
      data.push(this.getRandomInt(this.MIN, this.MAX));
    }
    return data;
  }

  /**
  * Converts a y-coordinate on the canvas to a graph y coordinate.
  */
  canvasYToGraphY(y) {
    // Top and bottom of the canvas coordinates.
    const chartArea = this.chart.chartArea;
    const top = chartArea.top;
    const bottom = chartArea.bottom;
    const scale = this.chart.chart.scales.y;
    // Start and end of the graph scale.
    const start = scale.start;
    const end = scale.end;
    // Factor scaling.
    const range = end - start;
    const canvasRange = bottom - top;
    const factor = range / canvasRange;
    // Convert position.
    const graphValue = (end - (y - top) * factor);
    // Clip to top and bottom of graph.
    if (graphValue < start) {
      return start;
    } 
    if (graphValue > end) {
      return end;
    }
    return graphValue;
  }

  /**
  * Creates a new chart.
  */
  newChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const title = 'Questions';
    const amount = this.getRandomInt(this.MIN_POINTS, this.MAX_POINTS);
    const ctx = document.getElementById('graph-canvas').getContext('2d');
    const data = this.generateData(amount);

    const options = {
      options: {
        title: {
          text: 'Students'
        },
        annotation: {
          events: ['click', 'mousemove'],
          annotations: [{
            id: 'line-divider',
            type: 'line',
            mode: 'horizontal',
            value: this.currentY.toString(),
            scaleID: 'y',
            borderColor: '#424242',
            borderWidth: 2,
            label: {
              content: this.currentY.toString(),
              enabled: true,
              position: 'right',
              xPadding: 12,
              yPadding: 12,
              fontFamily: 'Roboto',
              fontSize: 18,
              xAdjust: -50,
            },
          }]
        }
      }
    };

    // Create the dotplot with the fake data.
    this.dotplot = new DotPlot(ctx, [data]);
    this.chart = this.dotplot.chart;
    this.chart.chartState = this;

    // Listen to mouse move events.
    const canvas = document.getElementById('graph-canvas');
    const updateChart = (event) => {

      // Convert the canvas event y to a y-value on the graph.
      // Find the y position on chart.
      const chartY = this.canvasYToGraphY(event.offsetY);

      // Regenerate the colours.
      const dataset = this.chart.data.datasets[0];
      dataset.pointBackgroundColor = this.chart.chartState.generateColours(dataset.data, chartY);

      // Move the line divider and update the value of its label.
      const element = this.chart.annotation.elements['line-divider'];
      element.options.value = chartY;
      element.options.label.content = Math.round(chartY);

      // Update chart.
      this.chart.update();
    }
    //canvas.onmousemove = updateChart;
  }
}

// Initialization when the window loads.
window.onload = () => {
  const chartState = new ChartState();
  chartState.newChart();
}