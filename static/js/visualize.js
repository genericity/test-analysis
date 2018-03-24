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
    this.dividers = [
    new Divider({
      dividerId: 'line-divider-ab',
      text: 'A/B',
      index: 0,
      fieldId: 'ab-boundary',
      y: 2
    }, this),
    new Divider({
      dividerId: 'line-divider-bc',
      text: 'B/C',
      index: 1,
      fieldId: 'bc-boundary',
      y: 0
    }, this),
    new Divider({
      dividerId: 'line-divider-cd',
      text: 'C/D',
      index: 2,
      fieldId: 'cd-boundary',
      y: -2
    }, this)
    ];
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
      if (point.y > this.dividers[0].y) {
        colours.push(colourSchemes[scheme].a);
      } else if (point.y > this.dividers[1].y) {
        colours.push(colourSchemes[scheme].b);
      } else if (point.y > this.dividers[2].y) {
        colours.push(colourSchemes[scheme].c);
      } else {
        colours.push(colourSchemes[scheme].d);
      }
    }
    return colours;
  }

  /**
  * Retrieves dotplot data from the server.
  * @return {!Promise} A promise containing the data once it resolves.
  */
  getData() {
    return [];
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
    const studentData = this.getStudentData();
    const questionData = this.getQuestionData();
    const annotations = [this.dividers[0].annotation, this.dividers[1].annotation, this.dividers[2].annotation];

    const options = {
      annotation: {
        events: ['mousedown'],
        annotations: annotations
      }
    };

    // Create the dotplot with the fake data.
    this.dotplot = new DoubleDotPlot(ctx, {questions: questionData, students: studentData}, options);
    this.chart = this.dotplot.chart;
    this.chart.chartState = this;

    this.regenerateColours();
    this.chart.update();
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
    // Value checks.
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