"use strict";

const _ = require('lodash');

// Contains mappings: key -> direction
const DIRECTIONS = Object.freeze({
	// Left
	37: {
		x: -1,
		y: 0
	},

	// Up
	38: {
		x: 0,
		y: -1
	},

	// Right
	39: {
		x: 1,
		y: 0
	},

	// Down
	40: {
		x: 0,
		y: 1
	}
});

/**
 * Helper methods regarding directions
 */
export const Directions = {};

Directions.getDirectionFromKeyCode = function(keyCode) {
	if (keyCode in DIRECTIONS) {
		return DIRECTIONS[keyCode];
	}
};

Directions.getRandomDirection = function() {
	return _.sample(DIRECTIONS);
};

Directions.getOppositeDirection = function(direction) {
	return Object.freeze({
		x: -direction.x,
		y: -direction.y
	});
};