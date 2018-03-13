/*
* @fileoverview Utility functions for the tool.
*/

// Determines if a set is a superset of another set.
Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
}

// Generates a random integer between min and max.
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Rounds a number to [n] decimal places.
function roundToPlaces(num, places) {
    return Math.ceil(num * Math.pow(10, places)) / Math.pow(10, places);
}

// Capitalizes the first letter of a string.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}