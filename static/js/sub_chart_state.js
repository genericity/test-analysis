class SubChartState extends ChartState {
  /**
  * Constructor. Extends the original chart.
  */
  constructor() {
  	super();
  	// Disable the main dividers.
  	for (const divider of this.dividers) {
  		divider.disable();
  	}
  	const subdividers = [
      new Divider({
        dividerId: 'line-divider-ap',
        text: 'A+/A',
        index: 0,
        fieldId: 'ap-boundary',
        y: parseFloat(document.getElementById('ap-boundary').value),
        fontSize: 13,
      }, this),
      new Divider({
        dividerId: 'line-divider-a',
        text: 'A/A-',
        index: 1,
        fieldId: 'a-boundary',
        y: parseFloat(document.getElementById('a-boundary').value),
        fontSize: 13,
      }, this),
      new Divider({
        dividerId: 'line-divider-bp',
        text: 'B+/B',
        index: 3,
        fieldId: 'bp-boundary',
        y: parseFloat(document.getElementById('bp-boundary').value),
        fontSize: 13,
      }, this),
      new Divider({
        dividerId: 'line-divider-b',
        text: 'B/B-',
        index: 4,
        fieldId: 'b-boundary',
        y: parseFloat(document.getElementById('b-boundary').value),
        fontSize: 13,
      }, this),
      new Divider({
        dividerId: 'line-divider-cp',
        text: 'C+/C',
        index: 6,
        fieldId: 'cp-boundary',
        y: parseFloat(document.getElementById('cp-boundary').value),
        fontSize: 13,
      }, this),
      new Divider({
        dividerId: 'line-divider-c',
        text: 'C/C-',
        index: 7,
        fieldId: 'c-boundary',
        y: parseFloat(document.getElementById('c-boundary').value),
        fontSize: 13,
      }, this),
      new Divider({
        dividerId: 'line-divider-dp',
        text: 'D+/D',
        index: 9,
        fieldId: 'dp-boundary',
        y: parseFloat(document.getElementById('dp-boundary').value),
        fontSize: 13,
      }, this),
      new Divider({
        dividerId: 'line-divider-d',
        text: 'D/D-',
        index: 10,
        fieldId: 'd-boundary',
        y: parseFloat(document.getElementById('d-boundary').value),
        fontSize: 13,
      }, this),
    ];

  	// Extend the existing array of dividers with subdividers.
  	this.dividers = this.dividers.concat(subdividers);
  }
}