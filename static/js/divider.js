/* Represents a divider to select grade boundaries. */
class Divider {
	constructor(options, chartState) {
		/* {!Chart} The chart state containing the divider. */
		this.chartState = chartState;
		/* {string} The label text of the divider. */
		this.text = options.text;
		/* {string} The id of the divider as an annotation. */
		this.dividerId = options.dividerId;
		/* {number} The index of the divider. */
		this.index = options.index;
		/* {string} The id of the field displaying the number. */
		this.fieldId = options.fieldId;
		/* {number} The y-value of the divider on the chart. */
		this.y = options.y;
		/* {!Object} The divider's representation as an annotation. */
		this.annotation = {
          id: this.dividerId,
          type: 'line',
          mode: 'horizontal',
          value: this.y.toString(),
          scaleID: 'y',
          borderColor: '#424242',
          borderWidth: 2,
          label: {
            content: this.text,
            enabled: true,
            position: 'right',
            xPadding: 12,
            yPadding: 12,
            fontFamily: 'Roboto',
            fontSize: 18,
            xAdjust: -50,
          },
          onMousedown: (event) => {
            document.body.onmousemove = (event) => { this.midDrag(event, this.chartState); };
          }
        };

        // Add event listeners so that the grade boundary dividers are updated when the numeric values are changed.
		const field = document.getElementById(this.fieldId);
		field.oninput = () => {
			this.chartState.setGradeBoundary(this.dividerId, field.value);
		}
	}

	// Stops the drag event.
    stopDrag() {
      document.body.onmousemove = null;
      document.body.onmouseup = null;
    }

    // Handles the drag event.
    midDrag(event, chartState) {
      // Convert the canvas event y to a y-value on the graph.
      // Find the y position on chart.
      const chartY = chartState.canvasYToGraphY(event.offsetY);
      chartState.currentY = chartY;

      // Check that the B/C divider is not moving higher than the A/B divider, etc.
      if (this.index != 0 && chartY > this.chartState.dividers[this.index - 1].y) {
      	return;
      }
      // Check that the A/B divider is not moving lower than the B/C divider, etc.
      if (this.index != 2 && chartY < this.chartState.dividers[this.index + 1].y) {
        return;
      }

      // Update the position of that divider stored.
      this.y = chartY;

      // Regenerate the colours.
      chartState.regenerateColours();

      // Move the line divider and update the value of its label.
      chartState.setGradeBoundary(this.dividerId, chartY);

      // Update the input fields for the grade boundaries.
      document.getElementById(this.fieldId).value = roundToPlaces(chartY, 2);

      // Update chart.
      chartState.chart.update();

      document.body.onmouseup = this.stopDrag;
    }
}