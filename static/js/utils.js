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

// Given an object and a value, attempts to find the key for that value.
function getKeyByValue(obj, value) {
	for (const key in obj) {
		if (obj[key] == value) {
			return key;
		}
	}
}

// Determines if a value is a rational, non-infinite number.
function isNumber(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}

// Makes a GET request to the specified URL. Returned a promise that resolves when the request completes.
function get(url) {
  // Return a new promise.
  return new Promise((resolve, reject) => {
    // Create the XHR request.
    var request = new XMLHttpRequest();
    request.open('GET', url);

    request.onload = () => {
      // If the request completed successfully:
      if (request.status == 200) {
        // Resolve the promise with the response text.
        resolve(request.response);
      }
      else {
        // Otherwise, reject with the status text.
        reject(Error(request.statusText));
      }
    };

    // Handle network errors
    request.onerror = () => {
      reject(Error("Network Error"));
    };

    // Make the request
    request.send();
  });
}

// Attempts to convert a string into a boolean value.
function strToBool(string) {
  string = string.toLowerCase().trim();
  if (string == 'false' || string == '0') {
    return false;
  } else {
    return Boolean(string);
  }
}

const Utils = {
  // Allow a file to be downloaded whenever a user clicks on a certain element.
  downloadLink: function (element, data, filename) {
    // Whenever the element is clicked.
    element.onclick = (e) => {
      // Stop the link from firing.
      e.preventDefault();
      const link = document.createElement('a');
      link.download = filename;
      link.href = data;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      delete link;
    };
  },

  // Converts bytes to a human-readable size.
  bytesToSize: function(bytes) {
    // Sizes.
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    // 0 bytes.
    if (bytes == 0) {
      return '0 bytes';
    }
    const largest = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, largest), 2) + ' ' + sizes[largest];
  },

  // Returns the maximum element in an array.
  arrayMax: function(array) {
    if (array.length == 0) {
      return 0;
    }
    let largest = Number.NEGATIVE_INFINITY;
    for (const num of array) {
      if (!isNaN(num) && isNumber(num) && num > largest) {
        largest = num;
      }
    }
    return largest;
  },

  // Returns the minimum element in an array.
  arrayMin: function(array) {
    if (array.length == 0) {
      return 0;
    }
    let smallest = Number.POSITIVE_INFINITY;
    for (const num of array) {
      if (!isNaN(num) && isNumber(num) && num < smallest) {
        smallest = num;
      }
    }
    return smallest;
  },

  // Generates a range of integers from min to max. For example, [-3, -2, -1, 0, 1, 2, 3].
  generateRange: function(min, max, stepSize) {
    min = Math.floor(min);
    max = Math.ceil(max);

    const list = [];
    for (let i = min; i <= max; i+= stepSize) {
        list.push(i);
    }
    return list;
  },

  // Rounds to a step size, away from zero.
  roundTo: function(num, stepSize) {
    if (num > 0) {
      return parseInt(Math.ceil(num / stepSize) * stepSize);
    } else {
      return parseInt(Math.floor(num / stepSize) * stepSize);
    }
  },

  // Finds the mode of an array and counts how many times it occurs. O(n).
  modeCount: function(array) {
    if (array.length == 0) {
      return null;
    }
        
    let modeMap = {};
    let currentMode = array[0];
    let maxCount = 1;
    for (let i = 0; i < array.length; i++) {
        let element = array[i];
        if (modeMap[element] == null) {
          modeMap[element] = 1;
        } else {
          modeMap[element]++;
        }
        if (modeMap[element] > maxCount) {
          currentMode = element;
          maxCount = modeMap[element];
        }
    }
    return maxCount;
  }
}
