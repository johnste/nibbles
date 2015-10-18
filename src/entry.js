"use strict";

const Game = require('./Game.js').Game;

// Grab element and boot up the game in it
const element = document.getElementById('game');
var game = new Game(element);