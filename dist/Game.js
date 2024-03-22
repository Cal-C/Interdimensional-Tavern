"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iTavernGame = void 0;
var _characters = require("./characters.js");
var _core = require("boardgame.io/core");
var _Cards = require("./Cards.js");
const iTavernGame = exports.iTavernGame = {
  setup: _ref => {
    let {
      ctx
    } = _ref;
    return {
      //testing variables

      //rules variables
      maxHandSize: 10,
      //global variables
      initialized: false,
      drinkDeck: [],
      stack: [],
      //ids of cards to be played, allows players to counter each other's cards before resolution

      //not determined by characters, put personal to each player
      hand: {},
      handValidity: {},
      consumeDeck: {},
      discardDeck: {},
      discarding: {},
      discardingHand: {},
      //determined by characters
      characterID: {},
      characterShortName: {},
      characterLongName: {},
      characterDescription: {},
      health: {},
      drunkenness: {},
      maxHealth: {},
      minDrunkenness: {},
      cash: {},
      personalDeck: {}
    };
  },
  moves: {
    chooseCharacter,
    drawToMaxHand,
    startDiscarding,
    stopDiscarding,
    toggleDiscarding,
    discard,
    playCard,
    pass,
    consume,
    discardSelection
  },
  phases: {
    characterSelection: {
      start: true,
      moves: {
        chooseCharacter
      },
      next: "Main",
      turn: {
        order: _core.TurnOrder.DEFAULT,
        onBegin: _ref2 => {
          let {
            G,
            ctx
          } = _ref2;
          if (!G.initialized) {
            setupVariables({
              G,
              ctx
            });
            G.initialized = true;
          }
          console.log("Starting character selection");
        },
        onEnd: _ref3 => {
          let {
            G,
            ctx
          } = _ref3;
          console.log("Ending character selection");
        }
      }
    },
    Main: {
      start: false,
      next: "End",
      turn: {
        order: _core.TurnOrder.DEFAULT,
        onBegin: _ref4 => {
          let {
            G,
            ctx,
            events
          } = _ref4;
          console.log(JSON.stringify(ctx));
          console.log("Starting main phase with " + ctx.numPlayers + " players.");
          events.setActivePlayers({
            currentPlayer: 'Discard',
            others: 'React'
          });
        },
        onEnd: (G, ctx) => {
          console.log("Ending main phase");
        }
      },
      maxMoves: 1
    }
  },
  turn: {
    order: _core.TurnOrder.DEFAULT,
    onBegin: (G, ctx) => {
      console.log("Starting turn for player " + ctx.currentPlayer);
    },
    onEnd: (G, ctx) => {
      console.log("Ending turn for player " + ctx.currentPlayer);
    },
    stages: {
      React: {
        moves: {
          playCard,
          pass
        },
        next: "React",
        onBegin: (G, ctx) => {
          checkAllValidMoves({
            G,
            ctx
          });
          console.log("Starting react stage");
        }
      },
      Discard: {
        moves: {
          discardSelection,
          startDiscarding,
          stopDiscarding,
          toggleDiscarding,
          pass,
          playCard
        },
        next: "Draw",
        onBegin: (G, ctx) => {
          checkAllValidMoves({
            G,
            ctx
          });
          console.log("Starting discard stage");
        }
      },
      Draw: {
        moves: {
          drawToMaxHand,
          pass,
          playCard
        },
        next: "Action",
        onBegin: (G, ctx) => {
          checkAllValidMoves({
            G,
            ctx
          });
          console.log("Starting draw stage");
        }
      },
      Action: {
        moves: {
          playCard,
          pass
        },
        next: "Buy",
        onBegin: (G, ctx) => {
          checkAllValidMoves({
            G,
            ctx
          });
          console.log("Starting action stage");
        }
      },
      Buy: {
        moves: {
          pass
        },
        next: "Consume",
        onBegin: (G, ctx) => {
          checkAllValidMoves({
            G,
            ctx
          });
          console.log("Starting buy stage");
        }
      },
      Consume: {
        moves: {
          consume,
          pass
        },
        next: "End",
        onBegin: (G, ctx) => {
          checkAllValidMoves({
            G,
            ctx
          });
          console.log("Starting consume stage");
        }
      },
      End: {
        moves: {
          pass
        },
        next: "Draw",
        onBegin: (G, ctx) => {
          checkAllValidMoves({
            G,
            ctx
          });
          console.log("Starting end stage");
        }
      }
    }
  }
};
function discardSelection(_ref5, playID) {
  let {
    G,
    events,
    moves,
    ctx
  } = _ref5;
  console.log("Discarding selection for player " + playID);
  for (let i = G.discardingHand[playID].length; i >= 0; i--) {
    if (G.discardingHand[playID][i]) {
      discard({
        G
      }, i, playID);
    }
  }
  stopDiscardingInternal(G, ctx);
  events.setActivePlayers({
    currentPlayer: 'Draw',
    others: 'React'
  });
}
function discard(_ref6, i, playID) {
  let {
    G
  } = _ref6;
  console.log("Discarding card " + i + " for player " + playID);
  if (!G.hand[playID]) {
    console.log("Player " + playID + " has no hand");
    return;
  }
  if (!G.hand[playID][i]) {
    console.log("Player " + playID + " has no card at index " + i);
    return;
  }
  let card = G.hand[playID].splice(i, 1)[0];
  console.log("Discarding card " + card + " for player " + playID);
  //check if card has discard effect and do it
  G.discardDeck[playID].push(card);
  G.discardingHand[playID][i] = false;
}
function startDiscarding(_ref7) {
  let {
    G,
    ctx
  } = _ref7;
  G.discarding[ctx.currentPlayer] = true;
}
function stopDiscarding(_ref8) {
  let {
    G,
    ctx
  } = _ref8;
  stopDiscardingInternal(G, ctx);
}
function stopDiscardingInternal(G, ctx) {
  G.discarding[ctx.currentPlayer] = false;
  G.discardingHand = {
    ...G.discardingHand,
    [ctx.currentPlayer]: Array(G.maxHandSize).fill(false)
  };
}
function toggleDiscarding(_ref9, cardIndex, playerID) {
  let {
    G,
    ctx
  } = _ref9;
  G.discardingHand[playerID][cardIndex] = !G.discardingHand[playerID][cardIndex];
}
function chooseCharacter(_ref10, characterId) {
  let {
    G,
    playerID,
    ctx,
    events
  } = _ref10;
  if (G.characterID[playerID] !== "" && G.characterID[playerID] !== undefined && G.characterID[playerID] !== null) {
    console.log("Player " + playerID + " has already selected a character");
    return;
  }
  console.trace();
  console.log("Player " + playerID + " choose character id:" + characterId);
  let characterSelected = _characters.characters.find(character => character.id === characterId);
  if (characterSelected === undefined) {
    console.log("Character not found");
    return;
  }
  G.characterID[playerID] = characterSelected.id;
  G.characterShortName[playerID] = characterSelected.shortName;
  G.characterLongName[playerID] = characterSelected.longName;
  G.health[playerID] = characterSelected.defaultHealth;
  G.drunkenness[playerID] = characterSelected.defaultDrunkenness;
  G.maxHealth[playerID] = characterSelected.maxHealth;
  G.minDrunkenness[playerID] = characterSelected.minDrunkenness;
  G.cash[playerID] = characterSelected.cash;
  G.personalDeck[playerID] = [...characterSelected.Deck];
  G.hand[playerID] = [];
  G.handValidity[playerID] = [];
  console.log("Player " + playerID + " has loaded " + G.characterShortName[playerID]);
  G.personalDeck[playerID].sort(() => Math.random() - 0.5);
  if (checkIfAllCharactersSelected({
    G,
    ctx
  })) {
    console.log("All players have selected characters");
    //move to main phase
    allPlayersDrawToMaxHand({
      G,
      ctx
    });
    checkAllValidMoves({
      G,
      ctx
    });
    events.endPhase();
    return;
  }
  console.log("Not all players have selected characters");
  events.endTurn();
}
function checkAllValidMoves(_ref11) {
  let {
    G,
    ctx
  } = _ref11;
  console.time("Validity check time taken");
  let players = Object.keys(G.hand);
  players = players.filter(player => G.characterID[player] !== "" && G.characterID[player] !== undefined && G.characterID[player] !== null);
  players.forEach(player => {
    checkPlayerValidMoves({
      G,
      ctx
    }, player);
  });
  console.timeEnd("Validity check time taken");
}
function checkPlayerValidMoves(_ref12, playerChecked) {
  let {
    G,
    ctx
  } = _ref12;
  let cardIndex = 0;
  if (G.hand[playerChecked]) {
    G.hand[playerChecked].forEach(card => {
      checkValidMove({
        G,
        ctx
      }, playerChecked, cardIndex);
      cardIndex++;
    });
  }
}
function checkValidMove(_ref13, playerChecked, cardChecked) {
  let {
    G,
    ctx
  } = _ref13;
  let valid = false;
  let card = _Cards.Cards.find(card => card.id === G.hand[playerChecked][cardChecked]);
  if (card === undefined) {
    console.log("Card not found");
    return valid;
  }
  if (card.whenPlayable.includes("Action")) {
    if (ctx.currentPlayer === playerChecked && ctx.stage === "Action") {
      valid = true;
    }
  }
  if (card.whenPlayable.includes("Whenever")) {
    valid = true;
  }
  if (card.cashEffect !== null && card.cashEffect !== undefined) {
    if (G.cash[playerChecked] + card.cashEffect <= 0) {
      valid = false;
    }
  }
  console.log("Card " + cardChecked + " is valid: " + valid);
  G.handValidity[playerChecked][cardChecked] = valid;
  return valid;
}
function checkIfAllCharactersSelected(_ref14) {
  let {
    G,
    ctx
  } = _ref14;
  console.log(JSON.stringify(G.characterID));
  let players = Object.keys(G.characterID);
  let playersWithCharacters = players.filter(player => G.characterID[player] !== "" && G.characterID[player] !== undefined && G.characterID[player] !== null);
  console.log("Players with characters: " + playersWithCharacters.length + " Total players: " + ctx.numPlayers);
  return playersWithCharacters.length === ctx.numPlayers;
}
function allPlayersDrawToMaxHand(_ref15) {
  let {
    G,
    ctx
  } = _ref15;
  console.log("All players drawing to max hand " + JSON.stringify(G.characterID));
  let players = Object.keys(G.characterID);
  players.forEach(player => {
    let playerNumber = parseInt(player);
    drawToMaxHandInternal(G, ctx, playerNumber);
  });
}
function drawToMaxHand(_ref16) {
  let {
    G,
    ctx,
    playerID
  } = _ref16;
  drawToMaxHandInternal(G, ctx, playerID);
}
function drawToMaxHandInternal(G, ctx, playerID) {
  if (!G) {
    console.error('G is undefined');
    return;
  }
  if (!G.hand) {
    console.error('G.hand is undefined');
    //return;
  }
  if (!G.personalDeck) {
    console.error('G.personalDeck is undefined');
    return;
  }
  if (!G.hand[playerID]) {
    console.error("G.hand[".concat(playerID, "] is undefined"));
    return;
  }
  console.log("Drawing to max hand for player " + playerID);
  while (G.hand[playerID].length < G.maxHandSize) {
    if (!Array.isArray(G.personalDeck[playerID])) {
      console.log("Player " + playerID + "'s personal deck is not an array");
      break;
    }
    const newCard = G.personalDeck[playerID].pop();
    if (newCard === undefined) {
      console.log("Player " + playerID + " has no more cards to draw");
      break;
    }
    G.hand[playerID].push(newCard);
    console.log("Drew card " + newCard + " for player " + playerID);
  }
  console.log("Player " + playerID + " has drawn to max hand");
  checkPlayerValidMoves({
    G,
    ctx
  }, playerID);
}
function playCard(G, playerID, cardIndex) {
  let target = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  let card = G.hand[playerID].splice(cardIndex, 1);
  let cardPlayed = _Cards.Cards.find(card => card.id === card);
  if (cardPlayed === undefined) {
    console.log("Card not found");
    return _core.INVALID_MOVE;
  }
  if (cardPlayed.playType === "Heal") {
    G.drunkenness[playerID] -= cardPlayed.drunkennessDamage;
  }
  if (cardPlayed.playType === "SingleTargetAttack") {}
  if (cardPlayed.cashCost) {
    G.cash[playerID] -= cardPlayed.cashCost;
  }
}
function pass(_ref17) {
  let {
    G,
    playerID,
    ctx,
    events
  } = _ref17;
  if (ctx.phase === "End") {
    events.endTurn();
  }
  events.endStage();
  return;
}
function setupVariables(_ref18) {
  let {
    G,
    ctx
  } = _ref18;
  for (let i = 0; i < ctx.numPlayers; i++) {
    G.characterID[i] = "";
    G.characterShortName[i] = "";
    G.characterLongName[i] = "";
    G.characterDescription[i] = "";
    G.health[i] = 0;
    G.drunkenness[i] = 0;
    G.maxHealth[i] = 0;
    G.minDrunkenness[i] = 0;
    G.cash[i] = 0;
    G.personalDeck[i] = [];
    G.hand[i] = [];
    G.handValidity[i] = Array(G.maxHandSize).fill(false);
    G.consumeDeck[i] = [];
    G.discardDeck[i] = [];
    G.discarding[i] = false;
    G.discardingHand[i] = Array(G.maxHandSize).fill(false);
  }
}
function consume(_ref19, consumingPlayer) {
  let {
    G
  } = _ref19;
  let consumedCards = [];
  consumedCards.push(G.consumeDeck[consumingPlayer].pop());
}