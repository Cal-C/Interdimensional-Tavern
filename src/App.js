import React from 'react';
import { Client } from 'boardgame.io/react';
import { iTavernGame } from './Game.js';
import { Local } from 'boardgame.io/multiplayer';
import {TavernBoard} from './board.js';
//import { Card, CardWrapper } from 'react-ui-cards';

// Define your game rules


// Create a client
const GameClient = Client({ 
  game: iTavernGame,
  multiplayer: Local(),
  board: TavernBoard,
});

function App() {
  return (
    <div className="App">
      <h1>Interdimensional Tavern</h1>
      <GameClient playerID='0' />
      <GameClient playerID='1' />
      <GameClient playerID='2' />
      <GameClient playerID='3' />
      
    </div>
  );
}

export default App;