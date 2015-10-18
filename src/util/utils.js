"use strict";

const Graphics = require('pixi.js').Graphics;
const Sprite = require('pixi.js').Sprite;
const PIXI = require('pixi.js');

/**
 * Collection of mixed helper functions
 */

// Snap a position to the grid
export const snapToGrid = function(position, gridSize = 16) {
	return Math.ceil(position / gridSize) * gridSize - gridSize/2;
};

// Check if two entities collides
export const entityCollision = function(entityA, entityB) {
	const boxA = entityA.getBoundingBox();
	const boxB = entityB.getBoundingBox();
	return (boxA.x < boxB.x + boxB.width && boxA.x + boxA.width > boxB.x &&
   		boxA.y < boxB.y + boxB.height && boxA.height + boxA.y > boxB.y);
};

// Swap some keys in two objects
export const swapObjectKeys = function(obj1, obj2, keys = []) {
	keys.forEach(function(key) {
		const swap = obj1[key];
		obj1[key] = obj2[key];
		obj2[key] = swap;
	});
};

// Create a clickable 'play again' button
export const createPlayAgainButton = function(x, y, resetFn) {
	let graphics = new Graphics();
	graphics.lineStyle(1, 0x446644, 0.5);
	graphics.beginFill(0x446644, 1);

	graphics.drawRoundedRect(0, 0, 150, 60, 5);
	graphics.endFill();

	let button = new Sprite(graphics.generateTexture(false));
	button.anchor.set(0.5, 0.5);

	button.x = x;
	button.y = y;

	// Make sure we can click the button
	button.interactive = true;
	button.buttonMode = true;

	button.on('click', resetFn);

	let text = new PIXI.Text("Play again", { fill: "#55AA33"});
	text.anchor.set(0.5, 0.5);

	button.addChild(text);
	return button;
};