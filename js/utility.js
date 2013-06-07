/**
 * Returns a random integer between min and max
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
Math.rangeInt = function(min, max){
	if (max == undefined) {
		max = min;
		min = 0;
	}
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
