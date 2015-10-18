"use strict";

const PIXI = require('pixi.js');
const SnakeHead = require('./entities/SnakeHead.js').SnakeHead;
const Fruit = require('./entities/Fruit.js').Fruit;
const Wall = require('./entities/Wall.js').Wall;
const Timer = require('./util/Timer.js').Timer;
const Throttler = require('./util/Throttler.js').Throttler;
const utils = require('./util/utils.js');
const _ = require('lodash');
const TWEEN = require('tween.js');
const Player = require('./Player.js').Player;
const Sprite = require('pixi.js').Sprite;
const Graphics = require('pixi.js').Graphics;

const WORLD_DIMENSIONS = {
	width: 832,
	height: 832
};

/**
 * A snake game!
 * @constructor
 */
export const Game = function(element) {
	console.log('Game started');
	this.renderer = PIXI.autoDetectRenderer(WORLD_DIMENSIONS.width, WORLD_DIMENSIONS.height, {
		antialias: true
	});

	element.appendChild(this.renderer.view);
	this.stage = new PIXI.Container();

	this.levelContainer = new PIXI.DisplayObjectContainer();
	this.interfaceContainer = new PIXI.DisplayObjectContainer();
	this.stage.addChild(this.levelContainer);
	this.stage.addChild(this.interfaceContainer);

	this.timer = new Timer(
		1/60,
		[this.update.bind(this)],
		[this.render.bind(this), TWEEN.update.bind(TWEEN)]
	);

	document.addEventListener('keydown', e => {
		if (e.keyCode == 32) {
			this.reset();
		}
	});

	this.player = new Player(this.interfaceContainer);
	this.walls = [];
	this.fruits = [];
	this.snake = undefined;

	this.reset();
	this.timer.start();
};

Game.prototype.reset = function() {
	if(this.snake !== undefined) {
		this.snake.remove();
	}

	this.walls.map(wall => { wall.remove(); });
	this.fruits.map(fruit => { fruit.remove(); });
	this.player.resetScore();

	if (this.playAgainButton !== undefined) {
		this.playAgainButton.alpha = 0;
	}

	const wallDefaults = {
		stage: this.levelContainer,
		x: WORLD_DIMENSIONS.width / 2,
		y: WORLD_DIMENSIONS.height / 2,
		width: WORLD_DIMENSIONS.width,
		height: WORLD_DIMENSIONS.height
	};

	const createWall = function(options) {
		return new Wall(_.defaults(options, wallDefaults));
	};

	let walls = {
		left: createWall({ x: 16, direction: {x:1, y:0}, anchor: {x:1, y: 0.5}}),
		top: createWall({ y: 16, direction: {x:0, y:1}, anchor: {x:0.5, y: 1}}),
		right: createWall({ x: WORLD_DIMENSIONS.width - 16, direction: {x:-1, y:0}, anchor: {x:0, y: 0.5}}),
		bottom: createWall({ y: WORLD_DIMENSIONS.height - 16, direction: {x:0, y:-1}, anchor: {x:0.5, y: 0}})
	};

	walls.left.setOppositeWall(walls.right);
	walls.right.setOppositeWall(walls.left);
	walls.top.setOppositeWall(walls.bottom);
	walls.bottom.setOppositeWall(walls.top);

	this.walls = _.values(walls);

	this.snake = new SnakeHead({stage: this.levelContainer, snakeLength: 3});

	this.fruits = [
		Fruit.generateNewFruit({stage: this.levelContainer})
	];

	this.state = 'playing';
};

Game.prototype.update = function(dt) {

	if (this.state !== 'playing') {
		return;
	}

	this.snake.update(dt);

	this.snake.visitSegments((segment) => {
		if (this.snake === segment) {
			return;
		}

		// If the snake head is colliding with any of its segments, the snake dies.
		if(utils.entityCollision(this.snake, segment)) {
			this.onGameOver();
		}

		// If a snake segment (not the head) hits a wall, it means that a wall has moved
		// and is now colliding with some part of the snake. This kills the snake.
		this.walls.forEach((wall) => {
			if(utils.entityCollision(wall, segment)) {
				this.onGameOver();
			}
		});
	});

	this.walls.forEach((wall) => {
		if(utils.entityCollision(wall, this.snake))	{
			// Reverse the snake
			this.snake.reverse();

			// Move the wall opposite to the one we hit 113 pixels to make the play area smaller
			let oppositeWall = wall.getOppositeWall();
			if (oppositeWall) {
				oppositeWall.move(113);
			}
		}

		// If any fruit collides with a wall, kill the fruit
		this.fruits.forEach((fruit) => {
			if(utils.entityCollision(wall, fruit)) {
				fruit.alive = false;
			}
		});
	});


	this.fruits.forEach((fruit, index) => {
		fruit.update(dt);

		// Remove dead fruit
		if (!fruit.alive) {
			this.fruits.splice(index, 1);
			fruit.remove();
			this.fruits.push(Fruit.generateNewFruit({stage: this.levelContainer}));
			return;
		}

		// If the snake head collides with fruit, eat it! Yum!
		if(utils.entityCollision(fruit, this.snake))	{
			console.log('Hit!', fruit);
			fruit.alive = false;
			this.player.addScore();
			this.snake.addTail(10);
		}
	});
};

// Create
Game.prototype.onGameOver = function() {
	this.state = 'gameOver';

	if (this.playAgainButton === undefined) {
		this.playAgainButton = utils.createPlayAgainButton(
			WORLD_DIMENSIONS.width/2,
			WORLD_DIMENSIONS.height/2,
			() => { this.reset(); }
		);

		this.interfaceContainer.addChild(this.playAgainButton);
	}
	this.playAgainButton.alpha = 1;
};

Game.prototype.render = function() {
	this.renderer.render(this.stage);
};

