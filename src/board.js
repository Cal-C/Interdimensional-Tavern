import React, { useEffect, useState } from 'react';
import {float, Card, CardWrapper, UserCard } from 'react-ui-cards';
import {characters} from './characters.js';
import {iTavernGame} from './Game.js';
import {Cards} from './Cards.js'

import { PersonalDeckCard } from './CustomCards.js';

import Loading from 'react-loading';

export function TavernBoard(props) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Replace this with the actual logic to check if iTavernGame is loaded
    const checkIfGameIsLoaded = () => {
      const gameIsLoaded = Object.keys(props.G.handValidity).length > 0;
      setIsLoaded(gameIsLoaded);
    };
  
    checkIfGameIsLoaded();
  }, [props.G]);


  return (
    <div>
      {!isLoaded ? (
        <Loading type={"bars"} color={"#000000"} />
      ) : (
        <>
          <Header {...props} />
          {props.ctx.phase === "characterSelection" && <CharacterSelector {...props} />}
          {props.ctx.phase !== "characterSelection" && <StatusCards {...props} />}
          {props.ctx.phase !== "characterSelection" && <Hand {...props} />}
        </>
      )}
    </div>
  );
}




function Header({ctx, playerID}) {
  return (
    <div>
      <h1>Board for player {playerID}</h1>
      <h2>Phase: {ctx.phase}, Turn for Player: {ctx.currentPlayer}</h2>
      {ctx.activePlayers && playerID in ctx.activePlayers && <h2>My Phase: {ctx.activePlayers[playerID]}</h2>}
    </div>
  );
}


function StatusCards({ G, ctx }) {
  const userCards = [];
  for (let i = 0; i < ctx.numPlayers; i++) {
    if (isNotNullOrUndefined(G.characterID[i])) {
      userCards.push(
        <UserCard
          key={i}
          float
          name={G.characterLongName[i]}
          positionName= {'Player ' + i + ' status'}
          stats={[
            { name: 'Health', value: G.health[i] },
            { name: 'Drunkenness', value: G.drunkenness[i] },
            { name: 'Cash', value: G.cash[i] },
            
          ]}
          style={{ width: '300px', height: '500px' }}
        />
      );
    }
  }

  return (
    <div>
      <h1>Status of all players</h1>
        <div style={{ display: 'flex', justifyContent: 'left', flexWrap: 'wrap' }}>
          {userCards}
        </div>
    </div>
  );
}


function Hand({G, ctx, moves, playerID}) {
  return (
    <div>
      <h1>Your hand</h1>
      <div style={{ display: 'flex', justifyContent: 'left', flexWrap: 'wrap' }}>
        {Array.isArray(G.hand[playerID]) && G.hand[playerID].map((cardId, index) => (
          <DisplayCardinHand key={index} cardId={cardId} playerID={playerID} G={G} index={index} />
        ))}
      </div>
      {ctx.activePlayers[playerID] === "Draw" && <button onClick={() => moves.drawToMaxHand()}>Draw To Max</button>}
    </div>
  );
}

function DisplayCardinHand({cardId, playerID, G, index}) {
  const card = Cards.find(card => card.id === cardId);
  const isValid = G.handValidity[playerID][index];
  const cardColor = isValid ? '#76CC76' : '#D75265'; // replace 'green' and 'red' with actual color codes
  const playableEmoji = isValid ? '✅' : '❌';
  return (
    /*
    <UserCard
    float
    name={card.name}
    positionName={card.description}
    style={{ height: '550px',  color: cardColor }}
    stats = {[
      {name: 'Playable', value: playableEmoji + " " + camelToSpaced(card.whenPlayable.join(", "))}

    ]}
    />
    */
    <PersonalDeckCard
    float
    name={card.name}
    description={card.description}
    style={{ liftColor : cardColor }}
    stats = {[
      {name: 'Playable', value: playableEmoji + " " + camelToSpaced(card.whenPlayable.join(", "))},
      {name: 'Type', value: camelToSpaced(card.playType)},
    ]}
    />
  );
}


const CharacterSelector = (props) => {
  useEffect(() => {
    console.log('CharacterSelector rendered');
  });

  return (
    <div>
      <h1>Choose your character</h1>
      <ul>
        {characters.map((character, index) => (
          <li key={index}>
            <button onClick={() => props.moves.chooseCharacter(index)}>
              {character.shortName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default React.memo(CharacterSelector);

function isNotNullOrUndefined(value) {
  return value !== null && value !== undefined;
}

function camelToSpaced(str) {
  return str
    .replace(/([A-Z])/g, ' $1') // insert a space before all found uppercase letters
    .trim(); // remove the leading space
}