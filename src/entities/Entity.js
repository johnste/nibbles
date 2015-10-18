"use strict";

const Graphics = require('pixi.js').Graphics;
const Sprite = require('pixi.js').Sprite;
const PIXI = require('pixi.js');
const _ = require('lodash');
const snapToGrid = require('../util/utils.js').snapToGrid;
const Tween = require('../util/Tween.js').Tween;

/**
 * A game object, an object in the game world
 * @constructor
 */
export const Entity = function(options){
	Object.assign(this, _.defaults(options, {
		x: 450,
		y: 450,
		width: 16,
		height: 16,
		radius: 5,
		alive: true
	}));

	this.initGraphics();

	Tween.tweenScale(this.graphics.scale).start();
};

Entity.prototype.initGraphics = function() {
	if (this.graphics) {
		this.stage.removeChild(this.graphics);
	}

	this.graphics = this.createGraphics();
	this.stage.addChild(this.graphics);
	this.setPosition(this.x, this.y);
};

Entity.prototype.update = function(dt) {

};

Entity.prototype.getBoundingBox = function() {
	return {
		x: this.x - this.width * this.graphics.anchor.x,
		y: this.y - this.height * this.graphics.anchor.y,
		width: this.width,
		height: this.height
	};
};

Entity.prototype.remove = function() {
	this.stage.removeChild(this.graphics);
	this.alive = false;
};

Entity.prototype.setPosition = function(x, y) {
	this.graphics.x = this.x = snapToGrid(x);
	this.graphics.y = this.y = snapToGrid(y);
};

Entity.prototype.createGraphics = function() {
	console.error("Not implemented");
	return null;
};

Entity.prototype.createSprite = function(options) {
	options = _.defaults(options, {
		lineColor: 0xFFFFFF,
		fillColor: 0xFFFFFF
	});

	let graphics = new Graphics();
	graphics.lineStyle(1, options.lineColor, 0.25);
	graphics.beginFill(options.fillColor, 1);

	graphics.drawRoundedRect(0, 0, this.width, this.height, this.radius);
	graphics.endFill();
	graphics.x = this.x;
	graphics.y = this.y;

	let sprite = new Sprite(graphics.generateTexture(false));
	sprite.anchor.set(0.5, 0.5);

	// Entities will be tweened into existance
	sprite.scale.set(0, 0);
	return sprite;
};
