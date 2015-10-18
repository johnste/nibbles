"use strict";

const PIXI = require('pixi.js');

/**
 * Represents the player state: current score and high score. Updates the score display.
 * @constructor
 */
export const Player = function(stage) {
	this.stage = stage;
	this.score = 0;
	this.highScore = 2;
	this.scoreText = undefined;

	this.updateText();
};

Player.prototype.addScore = function() {
	this.score += 1;
	this.updateText();

	if (this.score > this.highScore) {
		this.highScore = this.score;
	}
};

Player.prototype.resetScore = function() {
	this.score = 0;
	this.scoreText.style.fill = "#ffffff";
	this.updateText();
};

Player.prototype.updateText = function() {
	if (this.scoreText === undefined) {
		this.scoreText = new PIXI.Text("Score: 0", { fill: "#ffffff"});
		this.scoreText.x = 20;
		this.scoreText.y = 20;
		this.stage.addChildAt(this.scoreText, 0);
		return;
	}

	if (this.score > this.highScore) {
		this.highScore = this.score;
		this.scoreText.style.fill = "#fffa4f";
	}

	this.scoreText.text = `Score: ${this.score}`;
};