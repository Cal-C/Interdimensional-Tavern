import React, {useState} from 'react';
import { Client } from 'boardgame.io/react';
import { iTavernGame } from './Game.js';
import { SocketIO } from 'boardgame.io/multiplayer';
import {TavernBoard} from './board.js';
//import { Card, CardWrapper } from 'react-ui-cards';

// Define your game rules


// Create a client
const GameClient = Client({ 
  game: iTavernGame,
  multiplayer: SocketIO({ server: 'localhost:8080' }),
  board: TavernBoard,
});

function App() {
  const [selectedPlayerID, setSelectedPlayerID] = useState(null);

  return (
    <div className="App">
      <h1>Interdimensional Tavern</h1>
      {selectedPlayerID === null ? (
        <>
          <button onClick={() => setSelectedPlayerID('0')}>Select Player 0</button>
          <button onClick={() => setSelectedPlayerID('1')}>Select Player 1</button>
          <button onClick={() => setSelectedPlayerID('2')}>Select Player 2</button>
          <button onClick={() => setSelectedPlayerID('3')}>Select Player 3</button>
        </>
      ) : (
        <GameClient playerID={selectedPlayerID} />
      )}
    </div>
  );
}


export default App;