import React, { useEffect, useState } from "react";
import { characters } from "./characters.js";
import { Cards } from "./Cards.js";

import { PersonalDeckCard, StatusCard } from "./CustomCards.js";

import Loading from "react-loading";

import Toaster from "./toaster.js";

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

  const activeToasts = props.G.activeToasts[props.playerID];

  return (
    <div>
      {!isLoaded ? (
        <Loading type={"bars"} color={"#000000"} />
      ) : (
        <>
          <Header {...props} />
          <Toaster {...props} />

          {props.ctx.phase === "characterSelection" && (
            <CharacterSelector {...props} />
          )}
          {props.ctx.phase !== "characterSelection" && (
            <StatusCards {...props} />
          )}
          {props.ctx.phase !== "characterSelection" && <Stack {...props} />}
          {props.ctx.phase !== "characterSelection" && <Hand {...props} />}
        </>
      )}
    </div>
  );
}

function Header({ ctx, playerID }) {
  let basicInformationString =
    "Board for player " +
    playerID +
    ", Phase: " +
    ctx.phase +
    ", Turn for Player: " +
    ctx.currentPlayer;
  if (ctx.activePlayers && playerID in ctx.activePlayers) {
    basicInformationString += ", My Stage: " + ctx.activePlayers[playerID];
  } else {
    basicInformationString += ", Not In a Stage";
  }
  return (
    <div>
      <h2
        style={{
          backgroundColor: "#2b2b62",
          color: "#f6f4e0",
          border: "5px solid #470b78",
          marginBottom: "5px",
          textAlign: "center",
        }}
      >
        {basicInformationString}
      </h2>
    </div>
  );
}

function StatusCards({ G, ctx, moves, playerID }) {
  const statusCards = [];
  for (let i = 0; i < ctx.numPlayers; i++) {
    if (isNotNullOrUndefined(G.characterID[i])) {
      statusCards.push(
        <StatusCard
          key={i}
          name={G.characterLongName[i]}
          stats={[
            { name: "Name", value: G.characterShortName[i] },
            { name: "Cash", value: G.cash[i] },
          ]}
          health={G.health[i]}
          maxHealth={G.maxHealth[i]}
          drunkenness={G.drunkenness[i]}
          minDrunkenness={G.minDrunkenness[i]}
          playerID={i}
          moves={moves}
          liftColor={characters[G.characterID[i]].Colors[1]}
          G={G}
          ctx={ctx}
          Colors={characters[G.characterID[i]].Colors}
          style={{
            height: "300px",
            width: "450px",
            minHeight: "300px",
            minWidth: "450px",
          }}
          targeted={G.targetingPlayer[playerID][i]}
        />
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        backgroundColor: "#2b2b62",
        border: "5px solid #470b78",
        marginBottom: "5px",
      }}
    >
      {statusCards}
    </div>
  );
}

function Stack({ G, moves, playerID }) {
  return (
    <div
      style={{
        border: "5px solid #470b78",
        marginBottom: "5px",
        backgroundColor: "#a07ac3",
      }}
    >
      <h1 style={{ margin: "0px", textAlign: "center" }}>
        Cards Played this Stage
      </h1>
      <div
        style={{ display: "flex", justifyContent: "left", flexWrap: "wrap" }}
      >
        {G.stack.map((card, index) => (
          <DisplayCardinStack
            index={index}
            cardId={card.cardId}
            playedByPlayerId={card.playedByPlayerId}
            G={G}
            moves={moves}
            playerID={playerID}
          />
        ))}
      </div>
    </div>
  );
}

function DisplayCardinStack({
  index,
  cardId,
  playedByPlayerId,
  G,
  moves,
  playerID,
}) {
  const card = Cards.find((card) => card.id === cardId);
  const liftColor = {
    0: "#b30b02",
    1: "#215212",
    2: "#0c07ad",
    3: "#ad07ac",
    default: "#07aaad",
  }[String(playedByPlayerId)];

  return (
    <PersonalDeckCard
      float
      name={card.name}
      description={card.description}
      style={{ liftColor: liftColor }}
      stats={[
        {
          name: "Playable",
          value: camelToSpaced(card.whenPlayable.join(", ")),
        },
        { name: "Type", value: camelToSpaced(card.playType) },
        { name: "Played By", value: "Player " + playedByPlayerId },
      ]}
      trashing={false}
      moves={moves}
      index={index}
      playerID={playedByPlayerId}
      Stack={true}
      G={G}
      liftColor={liftColor}
      Colors={characters[G.characterID[playedByPlayerId]].Colors}
    />
  );
}

function Hand({ G, ctx, moves, playerID }) {
  return (
    <div style={{ backgroundColor: "#D2b48c", border: "10px double black" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <PhaseButtons G={G} ctx={ctx} moves={moves} playerID={playerID} />
        <h1>Your hand</h1>
      </div>
      <div
        style={{ display: "flex", justifyContent: "left", flexWrap: "wrap" }}
      >
        {Array.isArray(G.hand[playerID]) &&
          G.hand[playerID].map((cardId, index) => (
            <DisplayCardinHand
              key={index}
              cardId={cardId}
              playerID={playerID}
              G={G}
              index={index}
              moves={moves}
            />
          ))}
      </div>
    </div>
  );
}

function PhaseButtons({ G, ctx, moves, playerID }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <h1 style={{ marginRight: "10px" }}>Stage Buttons</h1>
      {ctx.activePlayers[playerID] === "Discard" &&
        G.discarding[playerID] === false && (
          <button onClick={() => moves.startDiscarding()}>
            Start Discarding
          </button>
        )}
      {ctx.activePlayers[playerID] === "Discard" &&
        G.discarding[playerID] === true && (
          <>
            <button onClick={() => moves.stopDiscarding()}>
              Stop Discarding
            </button>
            <button onClick={() => moves.discardSelection(playerID)}>
              Discard and Move to Draw Stage
            </button>
          </>
        )}
      {ctx.activePlayers[playerID] === "React" && (
        <>
          <button onClick={() => moves.pass()}>Pass React Stage</button>
        </>
      )}
      {ctx.activePlayers[playerID] === "Draw" && (
        <>
          <button onClick={() => moves.drawToMaxHand()}>Draw to Max</button>
        </>
      )}
    </div>
  );
}

function DisplayCardinHand({ cardId, playerID, G, index, moves }) {
  const card = Cards.find((card) => card.id === cardId);
  const isValid = G.handValidity[playerID][index];
  const liftColor = isValid ? "#76CC76" : "#D75265"; // replace 'green' and 'red' with actual color codes
  const playableEmoji = isValid ? "✅" : "❌";
  return (
    <PersonalDeckCard
      float
      name={card.name}
      description={card.description}
      style={{ liftColor: liftColor }}
      stats={[
        {
          name: "Playable",
          value:
            playableEmoji + " " + camelToSpaced(card.whenPlayable.join(", ")),
        },
        { name: "Type", value: camelToSpaced(card.playType) },
      ]}
      trashing={G.discardingHand[playerID][index]}
      moves={moves}
      index={index}
      playerID={playerID}
      G={G}
      Colors={characters[G.characterID[playerID]].Colors}
    />
  );
}



const CharacterSelector = (props) => {
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
};
export default React.memo(CharacterSelector);

function isNotNullOrUndefined(value) {
  return value !== null && value !== undefined;
}

function camelToSpaced(str) {
  return str
    .replace(/([A-Z])/g, " $1") // insert a space before all found uppercase letters
    .trim(); // remove the leading space
}
