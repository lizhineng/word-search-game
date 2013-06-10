/**
 * Returns a random integer between min and max
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
if (typeof Math.rangeInt != 'function') {
  Math.rangeInt = function(min, max){
  	if (max == undefined) {
  		max = min;
  		min = 0;
  	}
  	return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

/**
 * Mege two objects
 *
 * @param {Object} o1 Object 1
 * @param {Object} o2 Object 2
 * @return {Object}
 */
if (typeof Object.merge != 'function') {
  Object.merge = function(o1, o2) {
    for (var i in o1) {
      o2[i] = o1[i];
    }
    return o2;
  }
}
