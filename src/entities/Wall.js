"use strict";

var Graphics = require('pixi.js').Graphics;
var Sprite = require('pixi.js').Sprite;
const _ = require('lodash');
const Entity = require('./Entity.js').Entity;
const Tween = require('../util/Tween.js').Tween;

/**
 * Represents a wall. It can
 * @constructor
 */
export let Wall = function(options){
	Entity.call(this, options);
};

Wall.prototype = Object.create(Entity.prototype);
Wall.prototype.constructor = Wall;

Wall.prototype.update = function(dt) {

};

Wall.prototype.setOppositeWall = function(wall) {
	this.oppositeWall = wall;
};

Wall.prototype.getOppositeWall = function() {
	return this.oppositeWall;
};

Wall.prototype.setPosition = function(x, y) {
	this.graphics.x = this.x = x;
	this.graphics.y = this.y = y;
};

Wall.prototype.move = function(pixels) {
	let y = this.y + this.direction.y * pixels;
	let x = this.x + this.direction.x * pixels;
	const end = { x, y };
	Tween.tweenPosition(this, end).start();
};

Wall.prototype.createGraphics = function() {
	let sprite = this.createSprite({
		lineColor: 0xFFFFFF,
		fillColor: 0x444444
	});

	sprite.anchor.set(this.anchor.x, this.anchor.y);
	return sprite;
};



