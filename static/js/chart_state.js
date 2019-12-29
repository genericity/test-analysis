class ChartState {
  /**
  * Constructor. Defines some constants.
  */
  constructor() {
    this.NUMERIC_MIN = -3;
    this.NUMERIC_MAX = 3;
    /* {Chart} The underlying chart. */
    this.chart = null;
    /* {Array<StudentRow>} An array of student objects. */
    this.students = [];
    /* {Array<QuestionRow>} An array of question objects. */
    this.questions = [];
    /* {Array<Divider>} An array of divider objects to drag on the chart. */
    this.dividers = [
      new Divider({
        dividerId: 'line-divider-ab',
        text: 'A/B',
        index: 2,
        fieldId: 'ab-boundary',
        y: parseFloat(document.getElementById('ab-boundary').value),
        position: 'left'
      }, this),
      new Divider({
        dividerId: 'line-divider-bc',
        text: 'B/C',
        index: 5,
        fieldId: 'bc-boundary',
        y: parseFloat(document.getElementById('bc-boundary').value),
        position: 'left'
      }, this),
      new Divider({
        dividerId: 'line-divider-cd',
        text: 'C/D',
        index: 8,
        fieldId: 'cd-boundary',
        y: parseFloat(document.getElementById('cd-boundary').value),
        position: 'left'
      }, this)
    ];

    /* {!Spinner} A spinner to display while the graph loads. */
    this.spinner = new Spinner(document.getElementById('canvas-container'));
  }

  /**
  * Generates a random integer between min and max.
  */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
  * Generates a list of colours - points above the y value of each divider have different colours.
  */
  generateColours(data, scheme) {
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
  getStudentData() {
    return studentHandler().then((students) => {
      this.students = students;

      const locations = [];

      for (const student of students) {
        // Round to one decimal place for better clustering.
        locations.push(roundToPlaces(student.location, 1));
      }

      return locations;
    });
  }

  /**
  * Retrieves dotplot data from the server.
  * @return {!Promise} A promise containing the data once it resolves.
  */
  getQuestionData() {
    return questionHandler().then((questions) => {
      this.questions = questions;

      const weights = [];

      for (const question of questions) {
        if (!question.removed) {
          // Round to one decimal place for better clustering.
          weights.push(roundToPlaces(question.itemWeight, 1));
        } else {
          weights.push(NaN);
        }
      }

      return weights;
    });
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

    const ctx = document.getElementById('graph-canvas').getContext('2d');

    // Wait until both student and question data has been retrieved.
    Promise.all([this.getQuestionData(), this.getStudentData()]).then((values) => {
      const studentData = values[1];
      const questionData = values[0];

      // The annotations of each of the dividers in the array.
      const annotations = [];
      for (const divider of this.dividers) {
        annotations.push(divider.annotation);
      }

      const options = {
        annotation: {
          events: ['mousedown'],
          annotations: annotations
        },
        tooltips: {
          callbacks: {
            // Use the callback to display student and question information in the title of the tooltip.
            title: (tooltipArray, data) => {
              // Display the ID, or the question number.
              const tooltipItem = tooltipArray[0];

              // If the object is a student or a question.
              const isStudent = tooltipItem.xLabel > 0;
              if (isStudent) {
                const student = this.students[tooltipItem.index];
                return 'ID: ' + student.id;
              } else {
                return 'Question ' + (tooltipItem.index + 1);
              }
            },
            // Use the callback to display student and question information in the label of the tooltip.
            beforeLabel: (tooltipItem, data) => {
              // Display the score, if this is a student, or the percentage correct.

              // If the object is a student or a question.
              const isStudent = tooltipItem.xLabel > 0;
              if (isStudent) {
                // The dataset that contains this object.
                const student = this.students[tooltipItem.index];
                return student.getPercentage();
              } else {
                const question = this.questions[tooltipItem.index];
                return question.getText();
              }
            },
            label: (tooltipItem, data) => {
              // Display the question weight or the student percentage.

              // If the object is a student or a question.
              const isStudent = tooltipItem.xLabel > 0;
              if (isStudent) {
                const student = this.students[tooltipItem.index];
                return student.getAnalyzedPercentage();
              } else {
                const question = this.questions[tooltipItem.index];
                return question.getPercentage();
              }
            },
            afterLabel: (tooltipItem, data) => {
              // Display the location, if this is a student.

              // If the object is a student or a question.
              const isStudent = tooltipItem.xLabel > 0;
              if (isStudent) {
                return 'Location: ' + tooltipItem.yLabel; 
              } else {
                return 'Weight: ' + tooltipItem.yLabel; 
              }
            },
            // The label colour of the tooltip.
            labelColor: (tooltipItem, chart) => {
              // Create the point.
              const chartY = tooltipItem.yLabel;
              const chartX = tooltipItem.xLabel;
              const point = {
                x: chartX,
                y: chartY,
              };

              // Select a colour scheme.
              const scheme = chartX > 0 ? 'blue': 'red';
              const color = this.generateColours([point], scheme)[0]
              return {
                backgroundColor: color
              };
            }
          }
        }
      };

      // Create the dotplot with the fake data.
      this.dotplot = new DoubleDotPlot(ctx, {questions: questionData, students: studentData}, options);
      this.chart = this.dotplot.chart;
      this.chart.chartState = this;
      this.NUMERIC_MIN = this.dotplot.yMin;
      this.NUMERIC_MAX = this.dotplot.yMax;

      this.regenerateColours();
      this.chart.update();

      if (this.spinner) {
        this.spinner.hide();
      }

      // Enable the fields for editing.
      for (const divider of this.dividers) {
        divider.enableField();
      }
      
      this.chart.height = "1300px";
    });
  }

  /*
  * Regenerate colours.
  */
  regenerateColours() {
    const datasetQuestions = this.chart.data.datasets[0];
    datasetQuestions.pointBackgroundColor = this.chart.chartState.generateColours(datasetQuestions.data, "red");
    const datasetStudents = this.chart.data.datasets[1];
    datasetStudents.pointBackgroundColor = this.chart.chartState.generateColours(datasetStudents.data, "blue");
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