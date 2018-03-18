class ChartState {
  /**
  * Constructor. Defines some constants.
  */
  constructor() {
    this.MIN = -6;
    this.MAX = 6;
    this.NUMERIC_MIN = -3;
    this.NUMERIC_MAX = 3;
    this.MIN_POINTS = 50;
    this.MAX_POINTS = 100;
    this.chart = null;
    this.currentY = 0;
    this.dividerY = [2, 0, -2];

    this.lineMap = {
      'A/B': {
        dividerId: 'line-divider-ab',
        label: 'A/B',
        index: 0,
        fieldId: 'ab-boundary'
      },
      'B/C': {
        dividerId: 'line-divider-bc',
        label: 'B/C',
        index: 1,
        fieldId: 'bc-boundary'
      },
      'C/D': {
        dividerId: 'line-divider-cd',
        label: 'C/D',
        index: 2,
        fieldId: 'cd-boundary'
      }
    }
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
  generateColours(data, y, scheme) {
    this.currentY = y;

    const colourSchemes = {
      blue: {
        a: '#BBDEFB',
        b: '#64B5F6',
        c: '#1E88E5',
        d: '#0D47A1'
      },
      red: {
        a: '#FFCDD2',
        b: '#E57373',
        c: '#E53935',
        d: '#820e0e'
      },
    }

    let colours = [];
    for (const point of data) {
      if (point.y > this.dividerY[0]) {
        colours.push(colourSchemes[scheme].a);
      } else if (point.y > this.dividerY[1]) {
        colours.push(colourSchemes[scheme].b);
      } else if (point.y > this.dividerY[2]) {
        colours.push(colourSchemes[scheme].c);
      } else {
        colours.push(colourSchemes[scheme].d);
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
      data.push(this.getRandomInt(this.MIN, this.MAX) / 2);
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

    const amount = this.getRandomInt(this.MIN_POINTS, this.MAX_POINTS);
    const ctx = document.getElementById('graph-canvas').getContext('2d');
    const studentData = this.generateData(amount);
    const questionData = this.generateData(amount);

    const options = {
      annotation: {
        events: ['mousedown'],
        annotations: [{
          id: 'line-divider-ab',
          type: 'line',
          mode: 'horizontal',
          value: this.dividerY[0].toString(),
          scaleID: 'y',
          borderColor: '#424242',
          borderWidth: 2,
          label: {
            content: 'A/B',
            enabled: true,
            position: 'right',
            xPadding: 12,
            yPadding: 12,
            fontFamily: 'Roboto',
            fontSize: 18,
            xAdjust: -50,
          },
          onMousedown: function(event) {
            document.body.onmousemove = (event) => { midDrag(event, 'A/B', this.chartInstance.chartState); };
          },
        }, {
          id: 'line-divider-bc',
          type: 'line',
          mode: 'horizontal',
          value: this.dividerY[1].toString(),
          scaleID: 'y',
          borderColor: '#424242',
          borderWidth: 2,
          label: {
            content: 'B/C',
            enabled: true,
            position: 'right',
            xPadding: 12,
            yPadding: 12,
            fontFamily: 'Roboto',
            fontSize: 18,
            xAdjust: -50,
          },
          onMousedown: function(event) {
            document.body.onmousemove = (event) => { midDrag(event, 'B/C', this.chartInstance.chartState); };
          }
        }, {
          id: 'line-divider-cd',
          type: 'line',
          mode: 'horizontal',
          value: this.dividerY[2].toString(),
          scaleID: 'y',
          borderColor: '#424242',
          borderWidth: 2,
          label: {
            content: 'C/D',
            enabled: true,
            position: 'right',
            xPadding: 12,
            yPadding: 12,
            fontFamily: 'Roboto',
            fontSize: 18,
            xAdjust: -50,
          },
          onMousedown: function(event) {
            document.body.onmousemove = (event) => { midDrag(event, 'C/D', this.chartInstance.chartState); };
          }
        }]
      }
    };

    // Create the dotplot with the fake data.
    this.dotplot = new DoubleDotPlot(ctx, {questions: questionData, students: studentData}, options);
    this.chart = this.dotplot.chart;
    this.chart.chartState = this;

    this.regenerateColours();
    this.chart.update();

    // Listen to mouse move events.
    const canvas = document.getElementById('graph-canvas');

    // Stops the drag event.
    function stopDrag() {
      document.body.onmousemove = null;
      document.body.onmouseup = null;
    }

    // Handles the drag event.
    function midDrag(event, draggerId, chartState) {
      const dragger = chartState.lineMap[draggerId];

      // Convert the canvas event y to a y-value on the graph.
      // Find the y position on chart.
      const chartY = chartState.canvasYToGraphY(event.offsetY);
      chartState.currentY = chartY;

      // Update the position of that divider stored.
      chartState.dividerY[dragger.index] = chartY;

      // Regenerate the colours.
      chartState.regenerateColours();

      // Move the line divider and update the value of its label.
      chartState.setGradeBoundary(dragger.dividerId, chartY);

      // Update the input fields for the grade boundaries.
      document.getElementById(dragger.fieldId).value = roundToPlaces(chartY, 2);

      // Update chart.
      chartState.chart.update();

      document.body.onmouseup = stopDrag;
    }

    // Add event listeners so that the grade boundary dividers are updated when the numeric values are changed.
    for (const dragger of Object.values(this.lineMap)) {
      const field = document.getElementById(dragger.fieldId);
      field.oninput = () => {
        this.setGradeBoundary(dragger.dividerId, field.value);
      }
    }
  }

  /*
  * Regenerate colours.
  */
  regenerateColours() {
    const datasetQuestions = this.chart.data.datasets[0];
    datasetQuestions.pointBackgroundColor = this.chart.chartState.generateColours(datasetQuestions.data, this.currentY, "red");
    const datasetStudents = this.chart.data.datasets[1];
    datasetStudents.pointBackgroundColor = this.chart.chartState.generateColours(datasetStudents.data, this.currentY, "blue");
  }

  /*
  * Sets the value of one of the grade boundary lines.
  */
  setGradeBoundary(id, value) {
    if (!id || !value || !isNumber(value)) {
      return;
    }

    // Find the divider.
    const element = this.chart.annotation.elements[id];

    // Set its value.
    element.options.value = Math.max(this.NUMERIC_MIN, Math.min(value, this.NUMERIC_MAX));

    // Update the chart.
    this.chart.update();
  }
}

// Initialization when the window loads.
window.onload = () => {
  const chartState = new ChartState();
  chartState.newChart();
}