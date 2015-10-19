"use strict";

const SnakeSegment = require('./SnakeSegment.js').SnakeSegment;
const Throttler = require('../util/Throttler.js').Throttler;
const Directions = require('../util/directions.js').Directions;

/**
 * Represents the snake head, a controllable version of a snake segment
 * @constructor
 */
export let SnakeHead = function(options){
	SnakeSegment.call(this, options);

	// Grab a random direction to start of with
	this.direction = Directions.getRandomDirection();
	this.speed = 0.1;

	if (options.snakeLength > 1) {
		this.addTail(options.snakeLength, this.direction);
	}

	this.moveThrottler = new Throttler(this.speed, () => this.move());

	this.listenToKey = e => {
		this.changeDirection(e.keyCode);
	};

	document.addEventListener('keydown', this.listenToKey);
};

SnakeHead.prototype = Object.create(SnakeSegment.prototype);
SnakeHead.prototype.constructor = SnakeHead;

SnakeHead.prototype.remove = function() {
	document.removeEventListener('keydown', this.listenToKey);
	SnakeSegment.prototype.remove.call(this);
};

SnakeHead.prototype.update = function(dt) {
	this.moveThrottler.update(dt);
	SnakeSegment.prototype.update.call(this, dt);
};

SnakeHead.prototype.move = function() {
	const x = this.x + this.direction.x * this.width;
	const y = this.y + this.direction.y * this.height;
	this.setPosition(x, y);
};

SnakeHead.prototype.changeDirection = function(keyCode) {
	const newDirection = Directions.getDirectionFromKeyCode(keyCode);
	if (newDirection !== undefined) {
		this.direction = newDirection;
	}
};

// Reverse the snake
SnakeHead.prototype.reverse = function() {

	// Get the current last segment. We'll save this and use for later.
	const lastSegment = this.getLastSegment();

	// Loop through all segments and switch their direction
	this.visitSegments((segment) => {
		segment.direction = Directions.getOppositeDirection(segment.direction);
	});

	// Rewire and reverse the snake segment flow by swapping the next and prev properties.
	let segment = this;
	while (segment) {
		let save = segment.next;
		segment.next = segment.prev;
		segment.prev = save;
		segment = save;
	}

	// Swap the physical position and info snake head and the final tail bit
	SnakeSegment.swapSegment(this, lastSegment);

	// Move the snake one step so it isn't still embedded in the wall
	this.move();
};

SnakeHead.prototype.createGraphics = function() {
	let sprite = this.createSprite({
		lineColor: 0xBBFF33,
		fillColor: 0xBBFF33
	});

	return sprite;
};



