"use strict";

export const timestamp = function() {
	if (window.performance && window.performance.now) {
		return window.performance.now();
	} else {
		return new Date().getTime();
	}
};

/**
 * Timer class, runs supplied functions at a fixed step, and other functions as often as possible
 * @constructor
 */
export const Timer = function(step = 1/60, fixed = [], always = []) {
	this.options = { step, fixed, always };

	this.last = timestamp();
	this.dt = 0;
	this.step = this.options.step;
};

Timer.prototype.start = function() {
	this.loop();
};

Timer.prototype.loop = function() {
	var now = timestamp();
	this.dt = this.dt + Math.min(1, (now - this.last) / 1000);

	this.options.always.map(fn => fn(now));

	while(this.dt > this.step) {
	    this.dt = this.dt - this.step;
	    this.options.fixed.map(fn => { fn(this.step); });
	}

	this.last = now;
	requestAnimationFrame(this.loop.bind(this));
};

