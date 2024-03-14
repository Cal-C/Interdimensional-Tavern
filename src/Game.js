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

        //not determined by characters, put personal to each player
        hand: {},
        handValidity: {},
        consumeDeck: {},
        discardDeck: {},
        

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
        
        
    }),
        
    moves: {
        chooseCharacter,
        drawToMaxHand,    
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
            moves: {discard, playCard, pass},
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
                moves: {discard, pass, playCard},
                
                next: "Draw",
                onBegin: (G, ctx) => {
                    checkAllValidMoves({G, ctx});
                    console.log("Starting discard stage");
                },
            },
            Draw: {
                moves: {drawToMaxHand, pass, playCard},
                next: "Action",
                onBegin: (G, ctx) => {
                    checkAllValidMoves({G, ctx});
                    console.log("Starting draw stage");
                },
            },
            Action: {
                moves: {playCard, pass},
                next: "Buy",
                onBegin: (G, ctx) => {
                    checkAllValidMoves({G, ctx});
                    console.log("Starting action stage");
                },
            },
            Buy: {
                moves: {pass},
                next: "Consume",
                onBegin: (G, ctx) => {
                    checkAllValidMoves({G, ctx});
                    console.log("Starting buy stage");
                },
            },
            Consume: {
                moves: {consume, pass},
                next: "End",
                onBegin: (G, ctx) => {
                    checkAllValidMoves({G, ctx});
                    console.log("Starting consume stage");
                },
            },
            End: {
                moves: {pass},
                next: "Draw",
                onBegin: (G, ctx) => {
                    checkAllValidMoves({G, ctx});
                    console.log("Starting end stage");
                },
            },
        }
    },

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
    G.hand[playerChecked].forEach(card => {
        checkValidMove({G, ctx}, playerChecked, cardIndex);
        cardIndex++;
    }); 
}

function checkValidMove({G, ctx}, playerChecked, cardChecked) {
    let valid = false;
    let card = Cards.find(card => card.id === G.hand[playerChecked][cardChecked]);
    if(card === undefined) {
        console.log("Card not found");
        return valid;
    }
    if(card.whenPlayable.includes("Action")) {
        if(ctx.currentPlayer === playerChecked && ctx.stage === "Action") {
            valid = true;
        }
    }
    if(card.whenPlayable.includes("Whenever")){
        valid = true;
    }

    if(card.cashEffect !== null && card.cashEffect !== undefined){
        if(G.cash[playerChecked] + card.cashEffect <= 0){
            valid = false;
        }

    }
    console.log("Card " + cardChecked + " is valid: " + valid);
    G.handValidity[playerChecked][cardChecked] = valid;
    return valid;

}



function checkIfAllCharactersSelected({G, ctx}) {
    console.log(JSON.stringify(G.characterID));
    let players = Object.keys(G.characterID);
    let playersWithCharacters = players.filter(player => (G.characterID[player] !== "" && G.characterID[player] !== undefined && G.characterID[player] !== null));
    console.log("Players with characters: " + playersWithCharacters.length + " Total players: " + ctx.numPlayers);
    return playersWithCharacters.length === ctx.numPlayers;
}

function allPlayersDrawToMaxHand({G, ctx}) {
    console.log("All players drawing to max hand " + JSON.stringify(G.characterID));
    let players = Object.keys(G.characterID);
    players.forEach(player => {
        drawToMaxHand(G, ctx, player);
    });
}

function drawToMaxHand (G, ctx, playerID) {
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
        console.log("Drew card " + newCard + " for player " + playerID);
    }
}

function discard(G, playerID, cardIndex) {
    G.discardDeck[playerID].push(G.hand[playerID].splice(cardIndex, 1));
}

function playCard(G, playerID, cardIndex, target = null) {
    let card = G.hand[playerID].splice(cardIndex, 1);
    let cardPlayed = Cards.find(card => card.id === card);
    if(cardPlayed === undefined) {
        console.log("Card not found");
        return INVALID_MOVE;
    }

    if(cardPlayed.playType === "Heal") {
        
        
        G.drunkenness[playerID] -= cardPlayed.drunkennessDamage;
    }
    if(cardPlayed.playType === "SingleTargetAttack") {

    }

    if(cardPlayed.cashCost) {
        G.cash[playerID] -= cardPlayed.cashCost;
    }
}

function pass({G, playerID, ctx, events}) {
    if(ctx.phase === "End"){
        events.endTurn();
    }
    events.endPhase();
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
    }
}

function consume({G}, consumingPlayer){
    let consumedCards = [];
    consumedCards.push(G.consumeDeck[consumingPlayer].pop());

}
