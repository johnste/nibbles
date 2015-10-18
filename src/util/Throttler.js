"use strict";

const _ = require('lodash');

/**
 * Helper class to make sure something only happens at a certain interval (in game time).
 * @constructor
 */
export const Throttler = function(wait, fn) {
	this.wait = wait;
	this.fn = fn;
	this.dt = 0;
};

Throttler.prototype.update = function(dt) {
	this.dt += dt;
	while(this.dt > this.wait) {
		if (_.isFunction(this.fn)) {
			this.fn(this.wait);
		}
		this.dt -= this.wait;
	}
};