import {characters} from './characters.js';
import { ActivePlayers, GameMethod, INVALID_MOVE, PlayerView, Stage, TurnOrder } from 'boardgame.io/core';
import { Cards } from './Cards.js';



export const iTavernGame = {
    setup: ({ctx}) => ({ 
        //testing variables
        
        //rules variables
        maxHandSize: 10,


        //global variables
        initialized : false,
        drinkDeck: [],
        stack: [], //ids of cards to be played, allows players to counter each other's cards before resolution

        //not determined by characters, put personal to each player
        hand: {},
        handValidity: {},
        consumeDeck: {},
        discardDeck: {},
        discarding: {},
        discardingHand: {},
        

        //determined by characters
        characterID : {},
        characterShortName : {},
        characterLongName : {},
        characterDescription : {},
        health : {},
        drunkenness : {},
        maxHealth : {},
        minDrunkenness : {}, 
        cash : {},
        personalDeck : {},

        targetingPlayer: {},

        activeToasts: {},
        
        
    }),
        
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
        removeToast,  
    },

    phases:{
        characterSelection: {
            start: true,
            moves: {chooseCharacter},
            next: "Main",
            turn: {
                order: TurnOrder.DEFAULT,
                onBegin: ({G, ctx}) => {
                    if(!G.initialized) {
                        setupVariables({G, ctx});
                        G.initialized = true;
                    }
                    console.log("Starting character selection");
                },
                onEnd: ({G, ctx}) => {
                    console.log("Ending character selection");
                },
            }
        },
        Main: {
            start: false,
            next: "End",
            turn: {
                order: TurnOrder.DEFAULT,
                onBegin: ({G, ctx, events}) => {
                    console.log(JSON.stringify(ctx))
                    console.log("Starting main phase with " + ctx.numPlayers + " players.");
                    events.setActivePlayers({ currentPlayer: 'Discard', others: 'React' });
                    
                },
                onEnd: (G, ctx) => {
                    console.log("Ending main phase");
                },
            },
            maxMoves: 1,
        },
        turn: {
            order: TurnOrder.DEFAULT,
            onBegin: (G, ctx) => {
                console.log("Starting turn for player " + ctx.currentPlayer);
            },
            onEnd: (G, ctx) => {
                console.log("Ending turn for player " + ctx.currentPlayer);
            },
            stages: {
                React:{
                    moves: {playCard, pass},
                    next: "React",
                    onBegin: (G, ctx) => {
                        checkAllValidMoves({G, ctx});
                        console.log("Starting react stage");
                    },
                },
                Discard: {
                    moves: {
                        discardSelection, 
                        startDiscarding, 
                        stopDiscarding, 
                        toggleDiscarding, 
                        pass, 
                        //playCard,
                        targetPlayer,
                    },
                    
                    next: "Draw",
                    onBegin: (G, ctx) => {
                        checkAllValidMoves({G, ctx});
                        console.log("Starting discard stage");
                    },
                },
                Draw: {
                    moves: {
                        drawToMaxHand, 
                        pass, 
                        //playCard,
                        targetPlayer
                    },
                    next: "Action",
                    onBegin: (G, ctx) => {
                        checkAllValidMoves({G, ctx});
                        console.log("Starting draw stage");
                    },
                },
                Action: {
                    moves: {
                        //playCard, 
                        pass,
                        targetPlayer,
                    },
                    next: "Buy",
                    onBegin: (G, ctx) => {
                        checkAllValidMoves({G, ctx});
                        console.log("Starting action stage");
                    },
                },
                Buy: {
                    moves: {
                        pass,
                    },
                    next: "Consume",
                    onBegin: (G, ctx) => {
                        checkAllValidMoves({G, ctx});
                        console.log("Starting buy stage");
                    },
                },
                Consume: {
                    moves: {
                        consume, 
                        pass,
                    },
                    next: "End",
                    onBegin: (G, ctx) => {
                        checkAllValidMoves({G, ctx});
                        console.log("Starting consume stage");
                    },
                },
                End: {
                    moves: {
                        pass,

                    },
                    next: "Draw",
                    onBegin: (G, ctx) => {
                        checkAllValidMoves({G, ctx});
                        console.log("Starting end stage");
                    },
                },
            }
        },
    },



}

function removeToast({G, ctx, playerID}, toastMessage) {
    console.log(`Removing toast: ${toastMessage}`);
    if (G.activeToasts && G.activeToasts[playerID]) {
      const index = G.activeToasts[playerID].indexOf(toastMessage);
      if (index !== -1) {
        G.activeToasts[playerID].splice(index, 1);
        console.log(`Removed toast: ${toastMessage}`);
      }
    }
  }

function discardSelection({G, events, moves, ctx}, playID) {
    console.log("Discarding selection for player " + playID);
    for(let i = G.discardingHand[playID].length; i >= 0; i--) {
        if(G.discardingHand[playID][i]) {
            discard({G}, i, playID);
        }
    }
    stopDiscardingInternal(G, ctx);
    events.setActivePlayers({ currentPlayer: 'Draw', others: 'React' });
}

function discard({G}, i, playID) {
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

function startDiscarding({G, ctx}) {
    G.discarding[ctx.currentPlayer] = true;
}

function stopDiscarding({G, ctx}) {
   stopDiscardingInternal(G, ctx);
}

function stopDiscardingInternal(G, ctx) {
    G.discarding[ctx.currentPlayer] = false;
    G.discardingHand = {
        ...G.discardingHand,
        [ctx.currentPlayer]: Array(G.maxHandSize).fill(false),
     };
}

function toggleDiscarding({G, ctx}, cardIndex, playerID) {
    G.discardingHand[playerID][cardIndex] = !G.discardingHand[playerID][cardIndex];
}


  
function chooseCharacter({G, playerID, ctx, events }, characterId ) {
    if(G.characterID[playerID] !== "" && G.characterID[playerID] !== undefined && G.characterID[playerID] !== null) {
        console.log("Player " + playerID + " has already selected a character");
        return;
    }
    console.trace();
    console.log("Player " + playerID + " choose character id:" + characterId);
    let characterSelected = characters.find(character => character.id === characterId);
    if(characterSelected === undefined) {
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

    if(checkIfAllCharactersSelected({G, ctx})){
        console.log("All players have selected characters");
        //move to main phase
        allPlayersDrawToMaxHand({G, ctx});
        checkAllValidMoves({G, ctx});
        events.endPhase();
        return; 
    }
    console.log("Not all players have selected characters");
    events.endTurn();
}


function checkAllValidMoves({G, ctx}) {
    console.time("Validity check time taken");
    let players = Object.keys(G.hand);
    players = players.filter(player => G.characterID[player] !== "" && G.characterID[player] !== undefined && G.characterID[player] !== null);
    players.forEach(player => {
        checkPlayerValidMoves({G, ctx}, player);
    });
    console.timeEnd("Validity check time taken");
}

function checkPlayerValidMoves({G, ctx}, playerChecked) {
    let cardIndex = 0;
    if (G.hand[playerChecked]) {
        G.hand[playerChecked].forEach(card => {
            checkValidMove({G, ctx}, playerChecked, cardIndex);
            cardIndex++;
        }); 
    }
}

function checkValidMove({G, ctx}, playerChecked, cardChecked) {
    if(G.hand[playerChecked] === null) {
        console.error("Player " + playerChecked + " has no hand");
        return false;
    }
    let valid = false;
    let card = Cards.find(card => card.id === G.hand[playerChecked][cardChecked]);
    if(card === undefined) {
        console.error("Card " + G.hand[playerChecked][cardChecked] +" not found");
        return valid;
    }
    if(card.whenPlayable.includes("Action")) {
       if(ctx.activePlayers){
        if(ctx.activePlayers[playerChecked]){
            if(ctx.activePlayers[playerChecked] === "Action") {
                valid = true;
            }
         }
       }
       else {
              console.error("Active players not found"); //this is expected to happen during setup, but should not happen after the first draw stage.
         }
    }
        
    if(card.whenPlayable.includes("Whenever")){
        valid = true;
    }

    G.handValidity[playerChecked][cardChecked] = valid;
    return valid;

}



function checkIfAllCharactersSelected({G, ctx}) {
    let players = Object.keys(G.characterID);
    let playersWithCharacters = players.filter(player => (G.characterID[player] !== "" && G.characterID[player] !== undefined && G.characterID[player] !== null));
    console.log("Players with characters: " + playersWithCharacters.length + " Total players: " + ctx.numPlayers);
    return playersWithCharacters.length === ctx.numPlayers;
}

function allPlayersDrawToMaxHand({G, ctx}) {
    console.log("All players drawing to max hand " + JSON.stringify(G.characterID));
    let players = Object.keys(G.characterID);
    players.forEach(player => {
        let playerNumber = parseInt(player);
        drawToMaxHandInternal(G, ctx, playerNumber);
    });
}

function drawToMaxHand({G, ctx, playerID}) {
    drawToMaxHandInternal(G, ctx, playerID);
}

function drawToMaxHandInternal (G, ctx, playerID) {
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
        console.error(`G.hand[${playerID}] is undefined`);
        return;
    }
    console.log("Drawing to max hand for player " + playerID);
    while (G.hand[playerID].length < G.maxHandSize) {
        if (!Array.isArray(G.personalDeck[playerID])) {
            console.log("Player " + playerID + "'s personal deck is not an array");
            break;
        }
        const newCard = G.personalDeck[playerID].pop();
        if(newCard === undefined) {
            console.log("Player " + playerID + " has no more cards to draw");
            break;
        }
        G.hand[playerID].push(newCard);
    }
    console.log("Player " + playerID + " has drawn to max hand");
    checkPlayerValidMoves({G, ctx}, playerID);
}

function playCard({G, playerID, ctx}, cardIndex, target = null) {
    checkPlayerValidMoves({G, ctx}, playerID);
    let cardLegal = checkValidMove({G, playerID}, playerID, cardIndex);

    let card = G.hand[playerID].splice(cardIndex, 1);
    let cardPlayed = Cards.find(c => c.id === card[0]);
    if(cardPlayed === undefined) {
        console.log("Card not found" + card);
        return INVALID_MOVE;
    }
    
    if(!cardLegal) {
        console.log("Card not legal" + card);
        return INVALID_MOVE;
    }

    if(cardPlayed.playType === "Heal") {
        if(target === null) { 
            target = playerID;
            console.log("Healing self");
            G.activeToasts[playerID].push("Healing self");
        }
    }
    if(cardPlayed.playType === "SingleTargetAttack") {
        if(target === null) { return INVALID_MOVE; }
    }
    if(cardPlayed.drunkennessEffect){G.drunkenness[target] += cardPlayed.drunkennessEffect;}
        
    if(cardPlayed.healthEffect){G.health[target] += cardPlayed.healthEffect};


    if(G.health[target] > G.maxHealth[target]) {
        G.health[target] = G.maxHealth[target];
    }
    if(G.drunkenness[target] < G.minDrunkenness[target]) {
        G.drunkenness[target] = G.minDrunkenness[target];
    }

    if(cardPlayed.cashCost) {
        G.cash[playerID] += cardPlayed.cashCost;
        //check if player has gone broke once that function is implemented
    }
    G.stack.push({cardId: card[0], playedByPlayerId: playerID});
    console.log("Player " + playerID + " played card " + card[0]);
    checkPlayerValidMoves({G, ctx}, playerID);
}

function pass({G, playerID, ctx, events}) {
    if(ctx.phase === "End"){
        events.endTurn();
    }
    events.endStage();
    return;
}

function setupVariables({G, ctx}){
    for(let i = 0; i < ctx.numPlayers; i++) {
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

        G.handValidity[i] =  Array(G.maxHandSize).fill(false);
        G.consumeDeck[i] = [];
        G.discardDeck[i] = [];
        G.discarding[i] = false;
        G.discardingHand[i] = Array(G.maxHandSize).fill(false);
        G.targetingPlayer[i] = {};
        for( let j = 0; j < ctx.numPlayers; j++){
            G.targetingPlayer[i][j] = false;
        }
        G.activeToasts[i] = [];
    }
}

function consume({G}, consumingPlayer){
    let consumedCards = [];
    consumedCards.push(G.consumeDeck[consumingPlayer].pop());

}

function targetPlayer({G, playerID}, targetPlayerID) {
    G.targetingPlayer[playerID][targetPlayerID] = !G.targetingPlayer[playerID][targetPlayerID];
}
