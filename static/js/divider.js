/* Represents a divider to select grade boundaries. */
class Divider {
	constructor(options, chartState) {
		/* {!Chart} The chart state containing the divider. */
		this.chartState = chartState;
		/* {string} The label text of the divider. */
		this.text = options.text;
		/* {string} The id of the divider as an annotation. */
		this.dividerId = options.dividerId;
		/* {number} The index of the divider. This represents a hierarchy, dividers with some index should always be above all dividers with larger indexes. */
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
        fontSize: (options.fontSize || 18),
        xAdjust: -50,
      },
      onMousedown: (event) => {
        document.body.onmousemove = (event) => { this.midDrag(event, this.chartState); };
      }
    };

    // Add event listeners so that the grade boundary dividers are updated when the numeric values are changed.
		const field = document.getElementById(this.fieldId);
		field.oninput = () => {
      if (this.isMoveValid(field.value)) {
        this.chartState.setGradeBoundary(this.dividerId, field.value);
      }
		}

    // Disable the fields initially while the graph is loading.
    field.disabled = true;
	}

  enableField() {
    document.getElementById(this.fieldId).disabled = false;
  }

  isMoveValid(chartY) {
    // Check that the B/C divider is not moving higher than the A/B divider, etc.
    // i.e. Check this divider's movement will not go higher than any divider with a lower index than it.
    for (const divider of this.chartState.dividers) {
      if (chartY < divider.y && divider.index > this.index) {
        return false;
      }
    }
    // Check that the A/B divider is not moving lower than the B/C divider, etc.
    // i.e. Check this divider's movement will not go lower than any divider with a higher index than it.
    for (const divider of this.chartState.dividers) {
      if (chartY > divider.y && divider.index < this.index) {
        return false;
      }
    }

    return true;
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

    if (!this.isMoveValid(chartY)) {
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

  // Make this divider unusable and undraggable.
  // Also adjusts visual state so that it appears undraggable.
  disable() {
    this.annotation.onMousedown = {};
    this.annotation.borderColor = 'rgba(150, 150, 150, 0.7)';
    this.annotation.label['backgroundColor'] = 'rgba(150, 150, 150, 0.7)';
  }
}