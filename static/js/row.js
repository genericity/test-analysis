/*
* Represents a row in a table.
*/
class Row {
	/*
	* @param {!Array} data An array of data, representing each column in the row.
	* @param {number} index The index or id of the row.
	*/
	constructor(data, index) {
		this.data = data;
		this.index = index;
	}

	/*
	* Generates the HTML markup for a cell given the data for inside the cell.
	* @param {string} data The value inside the cell.
	* @param {string} The HTML representation of the cell.
	*/
	generateCell(data) {
		return "<td>" + data + "</td>";
	}

	/*
	* Generates the HTML markup for the row.
	* @return {string} The HTML representation of the row.
	*/
	generateRow() {
		let row = '<tr class="' + this.status() + '">';
		for (const value of this.data) {
			row += this.generateCell(value);
		}
		return row + '</tr>';
	}

	/*
	* Child classes should override this with their own custom methods to decide if a row is marked red/green/neutral.
	* @return {string}
	*/
	status() {
		return 'neutral';
	}
}