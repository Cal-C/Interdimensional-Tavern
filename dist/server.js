"use strict";

const Server = require('boardgame.io/server').Server;
const Origins = require('boardgame.io/server').Origins;
const iTavernGame = require('./Game.js').iTavernGame;
const server = Server({
  games: [iTavernGame],
  origins: [Origins.LOCALHOST
  //'https://www.mygame.domain',
  ]
});
server.run(8080);