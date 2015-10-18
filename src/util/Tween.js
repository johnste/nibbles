"use strict";

const TWEEN = require('tween.js');

// Convert seconds to milliseconds
const timeFactor = function(time) {
	return time * 1000;
};

/**
 * Helper methods regarding directions
 */
export const Tween = {};

Tween.tweenScale = function(property, end = {x: 1, y: 1}, time = 1) {
	let tween = new TWEEN.Tween(property).to(end, timeFactor(time));
	tween.easing(TWEEN.Easing.Exponential.InOut);
	return tween;
};

Tween.tweenPosition = function(entity, end, time = 1) {
	let position = { x: entity.x, y: entity.y};
	let tween = new TWEEN.Tween(position).to(end, timeFactor(time));
	tween.easing(TWEEN.Easing.Bounce.Out);
	tween.onUpdate(() => {
		entity.graphics.x = entity.x = position.x;
		entity.graphics.y = entity.y = position.y;
	});
	return tween;
};