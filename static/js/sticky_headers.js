// Represents a table which has a sticky header.
class StickyHeader {
	constructor(element) {
		// Get the header row, which will stick.
		this.headerRow = this.getHeaderRowOfTable(element);
		// Clone it.
		this.clone = this.headerRow.cloneNode(true);
		this.clone.classList.add('floating-header');
		this.updateSize();
		// Add to the table.
		this.headerRow.parentNode.appendChild(this.clone);

		// The original element.
		this.table = element;

		// Update the width of the clone when the header's width changes.
		window.addEventListener('resize', () => {
			this.updateSize();
		});
	}

	getHeaderRowOfTable(table) {
		return table.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];
	}

	// Updates the cloned element's width to the new width.
	updateSize() {
		this.clone.style.width = (this.headerRow.getBoundingClientRect().width || this.headerRow.offsetWidth ) + 'px';
	}

	// Updates the visibility of the cloned header.
	updateIfVisible(scrollTop) {
		// Position of table on page.
		const offset = this.table.getBoundingClientRect().top + window.scrollY;
		// Height of the table.
		const height = this.table.offsetHeight;
		// Check if scroll position is within the range of the table.
		if ((scrollTop > offset) && (scrollTop < (offset + height))) {
			this.clone.classList.add('visible');
			this.updateSize();
		} else {
			this.clone.classList.remove('visible');
		}
	}
}

class StickyHeaderManager {
	/**
	* Constructor initiates all the sticky headers on the page.
	*/
	constructor() {
		this.tables = [];
		// Initiate the tables' headers to stick.
		const tables = document.getElementsByClassName('sticky-table');
		// For each table to be sticky.
		for (const table of tables) {
			this.tables.push(new StickyHeader(table));
		}

		// Update headers when the page scrolls.
		window.addEventListener('scroll', () => this.updateHeaders());
	}

	// Updates the visibility of stickied headers on scroll.
	updateHeaders(event) {
		let scrollTop = window.pageYOffset;
		// Check each table to be updated.
		for (const table of this.tables) {
			table.updateIfVisible(scrollTop);
		}
	}
}

const stickyHeaderManager = new StickyHeaderManager();