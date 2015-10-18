"use strict";

var Graphics = require('pixi.js').Graphics;
var Sprite = require('pixi.js').Sprite;
const _ = require('lodash');
const Entity = require('./Entity.js').Entity;
const Throttler = require('../util/Throttler.js').Throttler;
const timestamp = require('../util/Timer.js').timestamp;
const snapToGrid = require('../util/utils.js').snapToGrid;
const Tween = require('../util/Tween.js').Tween;

/**
 * Represents some tasty fruit, eatable by the snake.
 * @constructor
 */
export let Fruit = function(options){
	Entity.call(this, options);

	const timeToLive = Math.round(Math.random() * 6 + 3);

	this.removeThrottler = new Throttler(timeToLive, () => {
		const end = { x: 0, y: 0 };
		let tween = Tween.tweenScale(this.graphics.scale, end);
		tween.onComplete(() => {
			this.alive = false;
		});
		tween.start();
	});
};

// Factory function to generate new fruit
Fruit.generateNewFruit = function(options) {
	options = _.defaults(options, {
		x: snapToGrid(Math.round(Math.random() * 832 + 16)),
		y: snapToGrid(Math.round(Math.random() * 832 + 16))
	});
	console.log("New fruit at:", options.x, options.y);
	return new Fruit(options);
};

Fruit.prototype = Object.create(Entity.prototype);
Fruit.prototype.constructor = Fruit;

Fruit.prototype.update = function(dt) {
	this.removeThrottler.update(dt);
};

Fruit.prototype.createGraphics = function() {
	let sprite = this.createSprite({
		lineColor: 0xBB0033,
		fillColor: 0xFF0033
	});

	return sprite;
};