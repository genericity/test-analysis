class ChartState {
  /**
  * Constructor. Defines some constants.
  */
  constructor() {
    this.MIN = 0;
    this.MAX = 100;
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
  * Generates a list (n = amount) of random points.
  */
  generateData(amount) {
    let data = [];
    // Validate data.
    if (!amount || amount < this.MIN_POINTS || amount > this.MAX_POINTS) {
      return data;
    }

    for (let i = 0; i < amount; i++) {
      const newData = {
        x: this.getRandomInt(this.MIN, this.MAX),
        y: this.getRandomInt(this.MIN, this.MAX)
      };
      data.push(newData);
    }

    return data;
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

    const title = document.getElementById('input-title').value || 'Sample graph';
    const amount = document.getElementById('input-points').value || this.getRandomInt(this.MIN_POINTS, this.MAX_POINTS);
    const ctx = document.getElementById('graph-canvas').getContext('2d');
    const data = this.generateData(amount);
    const options = {
      type: 'scatter',
      data: {
        datasets: [{
            label: 'Sample dataset',
            data: data,
            pointBackgroundColor: this.generateColours(data, this.currentY),
        }]
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 50
          }
        },
        title: {
          display: true,
          position: 'top',
          fontSize: 32,
          fontColor: '#424242',
          padding: 24,
          text: title,
        },
        scales: {
            xAxes: [{
              type: 'linear',
              position: 'bottom',
              display: false,
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
      },
    };
    // Set font and point radius.
    Chart.defaults.global.defaultFontFamily = 'Roboto';
    Chart.defaults.global.elements.point.radius = 5;
    Chart.defaults.global.defaultFontSize = 15;

    // Create chart.
    this.chart = new Chart(ctx, options);
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
    canvas.onmousemove = updateChart;
  }
}

// Initialization when the window loads.
window.onload = () => {
  const chartState = new ChartState();
  chartState.newChart();

  // Listen to the generate chart button.
  const generateButton = document.getElementById('generate');
  generateButton.onclick = () => {
    chartState.newChart();
  };
  // Also listen to the slider.
  const slider = document.getElementById('input-points');
  slider.onchange = () => {
    chartState.newChart();
  };
}