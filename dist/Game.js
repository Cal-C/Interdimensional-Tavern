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
      personalDeck: {},
      targetingPlayer: {},
      activeToasts: {},
      toastNumber: 0
    };
  },
  moves: {
    //moves for specific phases
    //discard
    discardSelection,
    startDiscarding,
    stopDiscarding,
    toggleDiscarding,
    //draw
    drawToMaxHand,
    //universal moves
    playCard,
    pass,
    targetPlayer,
    removeToast
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
            targetPlayer
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
            targetPlayer
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
            pass,
            targetPlayer
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
  }
};
function removeToast(_ref5, toastObject) {
  let {
    G,
    playerID
  } = _ref5;
  if (G.activeToasts && G.activeToasts[playerID]) {
    const index = G.activeToasts[playerID].findIndex(toast => toast.id === toastObject.id);
    if (index !== -1) {
      G.activeToasts[playerID].splice(index, 1);
    }
  }
}
function discardSelection(_ref6, playID) {
  let {
    G,
    events,
    moves,
    ctx
  } = _ref6;
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
function discard(_ref7, i, playID) {
  let {
    G
  } = _ref7;
  if (!G.hand[playID]) {
    console.error("Player " + playID + " has no hand");
    return;
  }
  if (!G.hand[playID][i]) {
    console.error("Player " + playID + " has no card at index " + i);
    return;
  }
  let card = G.hand[playID].splice(i, 1)[0];
  //check if card has discard effect and do it
  G.discardDeck[playID].push(card);
  G.discardingHand[playID][i] = false;
}
function startDiscarding(_ref8) {
  let {
    G,
    ctx
  } = _ref8;
  G.discarding[ctx.currentPlayer] = true;
}
function stopDiscarding(_ref9) {
  let {
    G,
    ctx
  } = _ref9;
  stopDiscardingInternal(G, ctx);
}
function stopDiscardingInternal(G, ctx) {
  G.discarding[ctx.currentPlayer] = false;
  G.discardingHand = {
    ...G.discardingHand,
    [ctx.currentPlayer]: Array(G.maxHandSize).fill(false)
  };
}
function toggleDiscarding(_ref10, cardIndex, playerID) {
  let {
    G,
    ctx
  } = _ref10;
  G.discardingHand[playerID][cardIndex] = !G.discardingHand[playerID][cardIndex];
}
function chooseCharacter(_ref11, characterId) {
  let {
    G,
    playerID,
    ctx,
    events
  } = _ref11;
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
function checkAllValidMoves(_ref12) {
  let {
    G,
    ctx
  } = _ref12;
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
function checkPlayerValidMoves(_ref13, playerChecked) {
  let {
    G,
    ctx
  } = _ref13;
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
function checkValidMove(_ref14, playerChecked, cardChecked) {
  let {
    G,
    ctx
  } = _ref14;
  if (G.hand[playerChecked] === null) {
    console.error("Player " + playerChecked + " has no hand");
    return false;
  }
  let valid = false;
  let card = _Cards.Cards.find(card => card.id === G.hand[playerChecked][cardChecked]);
  if (card === undefined) {
    console.error("Card " + G.hand[playerChecked][cardChecked] + " not found");
    return valid;
  }
  if (card.whenPlayable.includes("Action")) {
    if (ctx.activePlayers) {
      if (ctx.activePlayers[playerChecked]) {
        if (ctx.activePlayers[playerChecked] === "Action") {
          valid = true;
        }
      }
    } else {
      console.error("Active players not found"); //this is expected to happen during setup, but should not happen after the first draw stage.
    }
  }
  if (card.whenPlayable.includes("Whenever")) {
    valid = true;
  }
  G.handValidity[playerChecked][cardChecked] = valid;
  return valid;
}
function checkIfAllCharactersSelected(_ref15) {
  let {
    G,
    ctx
  } = _ref15;
  let players = Object.keys(G.characterID);
  let playersWithCharacters = players.filter(player => G.characterID[player] !== "" && G.characterID[player] !== undefined && G.characterID[player] !== null);
  console.log("Players with characters: " + playersWithCharacters.length + " Total players: " + ctx.numPlayers);
  return playersWithCharacters.length === ctx.numPlayers;
}
function allPlayersDrawToMaxHand(_ref16) {
  let {
    G,
    ctx
  } = _ref16;
  console.log("All players drawing to max hand " + JSON.stringify(G.characterID));
  let players = Object.keys(G.characterID);
  players.forEach(player => {
    let playerNumber = parseInt(player);
    drawToMaxHandInternal(G, ctx, playerNumber);
  });
}
function drawToMaxHand(_ref17) {
  let {
    G,
    ctx,
    playerID
  } = _ref17;
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
  }
  console.log("Player " + playerID + " has drawn to max hand");
  checkPlayerValidMoves({
    G,
    ctx
  }, playerID);
}
function makeToast(_ref18, forPlayer, message) {
  let {
    G
  } = _ref18;
  let type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "default";
  if (!G.activeToasts[forPlayer]) {
    G.activeToasts[forPlayer] = [];
  }
  G.activeToasts[forPlayer].push({
    message: message,
    id: G.toastNumber,
    type: type
  });
  G.toastNumber++;
}
function determineTargetedPlayers(_ref19, checkingPlayer) {
  let {
    G
  } = _ref19;
  let players = G.targetingPlayer[checkingPlayer];
  players = Object.keys(players).filter(player => players[player] === true);
  return players;
}
function playCard(_ref20, cardIndex) {
  let {
    G,
    playerID,
    ctx
  } = _ref20;
  let targets = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  checkPlayerValidMoves({
    G,
    ctx
  }, playerID);
  let healed = 0;
  let cardLegal = checkValidMove({
    G,
    playerID
  }, playerID, cardIndex);
  targets = determineTargetedPlayers({
    G
  }, playerID);
  let card = G.hand[playerID].splice(cardIndex, 1);
  let cardPlayed = _Cards.Cards.find(c => c.id === card[0]);
  if (cardPlayed === undefined) {
    console.log("Card not found" + card);
    return _core.INVALID_MOVE;
  }
  if (!cardLegal) {
    console.log("Card not legal" + card);
    return _core.INVALID_MOVE;
  }
  if (cardPlayed.playType === "Heal") {
    if (targets.length === 0) {
      targets[0] = playerID;
      makeToast({
        G
      }, targets[0], "Healing self, since no target was selected.", "warn");
    }
  }
  if (cardPlayed.playType === "SingleTargetAttack") {
    if (targets.length === 0) {
      makeToast({
        G
      }, playerID, "No target selected for single target attack.", "warn");
      return _core.INVALID_MOVE;
    }
    if (targets.length > 1) {
      makeToast({
        G
      }, playerID, "Too many targets selected for single target attack.", "warn");
      return _core.INVALID_MOVE;
    }
    //eventually add a check if player is hitting themselves, and if so ask for confirmation
  }
  if (cardPlayed.drunkennessEffect) {
    for (let target of targets) {
      G.drunkenness[target] += cardPlayed.drunkennessEffect;
    }
    healed -= cardPlayed.drunkennessEffect;
  }
  if (cardPlayed.healthEffect) {
    for (let target of targets) {
      G.health[target] += cardPlayed.healthEffect;
    }
    healed += cardPlayed.healthEffect;
  }
  ;
  for (let target of targets) {
    if (G.health[target] <= 0) {
      makeToast({
        G
      }, playerID, "Player " + target + " has been defeated.", "warn");
    }
    if (G.health[target] > G.maxHealth[target]) {
      G.health[target] = G.maxHealth[target];
    }
    if (G.drunkenness[target] < G.minDrunkenness[target]) {
      G.drunkenness[target] = G.minDrunkenness[target];
    }
  }
  if (cardPlayed.cashCost) {
    G.cash[playerID] += cardPlayed.cashCost;
    //check if player has gone broke once that function is implemented
  }
  G.stack.push({
    cardId: card[0],
    playedByPlayerId: playerID
  });
  console.log("Player " + playerID + " played card " + card[0]);
  checkPlayerValidMoves({
    G,
    ctx
  }, playerID);
}
function pass(_ref21) {
  let {
    G,
    playerID,
    ctx,
    events
  } = _ref21;
  if (ctx.phase === "End") {
    events.endTurn();
  }
  events.endStage();
  return;
}
function setupVariables(_ref22) {
  let {
    G,
    ctx
  } = _ref22;
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
    G.targetingPlayer[i] = {};
    for (let j = 0; j < ctx.numPlayers; j++) {
      G.targetingPlayer[i][j] = false;
    }
    G.activeToasts[i] = [];
  }
}
function consume(_ref23, consumingPlayer) {
  let {
    G
  } = _ref23;
  let consumedCards = [];
  consumedCards.push(G.consumeDeck[consumingPlayer].pop());
}
function targetPlayer(_ref24, targetPlayerID) {
  let {
    G,
    playerID
  } = _ref24;
  G.targetingPlayer[playerID][targetPlayerID] = !G.targetingPlayer[playerID][targetPlayerID];
}