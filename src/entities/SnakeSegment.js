"use strict";

const _ = require('lodash');
const Entity = require('./Entity.js').Entity;
const utils = require('../util/utils.js');

/**
 * Represents a snake segment, a part of the snake which can have another segment
 * attached to its end, and a segment attached before it.
 * @constructor
 */
export let SnakeSegment = function(options){
	options = _.defaults(options, {
		direction: undefined
	});
	Entity.call(this, options);
};

SnakeSegment.swapSegment = function(segment1, segment2) {
	utils.swapObjectKeys(segment1, segment2, [
		'x', 'y', 'direction', 'next', 'prev'
	]);

	// Make sure adjacent segments point to the swapped segments
	if (segment1.next) segment1.next.prev = segment1;
	if (segment1.prev) segment1.prev.next = segment1;
	if (segment2.next) segment2.next.prev = segment2;
	if (segment2.prev) segment2.prev.next = segment2;
};

SnakeSegment.prototype = Object.create(Entity.prototype);
SnakeSegment.prototype.constructor = SnakeSegment;

SnakeSegment.prototype.update = function(dt) {
	if (this.next) {
		this.next.update(dt);
	}
};

// Recursively add tail segments. If the current segment already has a tail, keep
// going through the snake add the new segment to the last point.
SnakeSegment.prototype.addTail = function(length, direction = {x:0, y:0}) {

	if (this.next) {
		return this.next.addTail(length);
	}

	this.tailSegment = length;
	if (length === 0) {
		return;
	}

	// Create a new tail segment
	this.next = new SnakeSegment({
		stage: this.stage,
		prev: this,
		x: this.x - direction.x * this.width,
		y: this.y - direction.y * this.height,
		direction: _.clone(this.direction),
	});

	this.next.addTail(length-1, direction);
};

SnakeSegment.prototype.remove = function() {
	// When removing snake segments, make sure any attached segments are also removed
	Entity.prototype.remove.call(this);
	if (this.next) {
		this.next.remove();
	}
};

SnakeSegment.prototype.setPosition = function(x, y) {
	const oldPosition = {
		x: this.x,
		y: this.y
	};

	Entity.prototype.setPosition.call(this, x, y);

	// When updating the position of the snake, send the old position to the next segment,
	// if available.
	if (this.next !== undefined) {
		this.next.setPosition(oldPosition.x, oldPosition.y);
		this.next.direction = this.direction;
	}
};

SnakeSegment.prototype.getLastSegment = function() {
	if (this.next !== undefined) {
		return this.next.getLastSegment();
	} else {
		return this;
	}
};

SnakeSegment.prototype.visitSegments = function(fn) {
	fn(this);
	if (this.next !== undefined) {
		this.next.visitSegments(fn);
	}
};

SnakeSegment.prototype.createGraphics = function() {
		let sprite = this.createSprite({
		lineColor: 0xBBFF33,
		fillColor: 0x99AA22
	});

	return sprite;
};