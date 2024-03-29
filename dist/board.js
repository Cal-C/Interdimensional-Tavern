"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TavernBoard = TavernBoard;
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _characters = require("./characters.js");
var _Cards = require("./Cards.js");
var _CustomCards = require("./CustomCards.js");
var _reactLoading = _interopRequireDefault(require("react-loading"));
var _toaster = _interopRequireDefault(require("./toaster.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function TavernBoard(props) {
  const [isLoaded, setIsLoaded] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    // Replace this with the actual logic to check if iTavernGame is loaded
    const checkIfGameIsLoaded = () => {
      const gameIsLoaded = Object.keys(props.G.handValidity).length > 0;
      setIsLoaded(gameIsLoaded);
    };
    checkIfGameIsLoaded();
  }, [props.G]);
  const activeToasts = props.G.activeToasts[props.playerID];
  return /*#__PURE__*/_react.default.createElement("div", null, !isLoaded ? /*#__PURE__*/_react.default.createElement(_reactLoading.default, {
    type: "bars",
    color: "#000000"
  }) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Header, props), /*#__PURE__*/_react.default.createElement(_toaster.default, props), props.ctx.phase === "characterSelection" && /*#__PURE__*/_react.default.createElement(CharacterSelector, props), props.ctx.phase !== "characterSelection" && /*#__PURE__*/_react.default.createElement(StatusCards, props), props.ctx.phase !== "characterSelection" && /*#__PURE__*/_react.default.createElement(Stack, props), props.ctx.phase !== "characterSelection" && /*#__PURE__*/_react.default.createElement(Hand, props)));
}
function Header(_ref) {
  let {
    ctx,
    playerID
  } = _ref;
  let basicInformationString = "Board for player " + playerID + ", Phase: " + ctx.phase + ", Turn for Player: " + ctx.currentPlayer;
  if (ctx.activePlayers && playerID in ctx.activePlayers) {
    basicInformationString += ", My Stage: " + ctx.activePlayers[playerID];
  } else {
    basicInformationString += ", Not In a Stage";
  }
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("h2", {
    style: {
      backgroundColor: "#2b2b62",
      color: "#f6f4e0",
      border: "5px solid #470b78",
      marginBottom: "5px",
      textAlign: "center"
    }
  }, basicInformationString));
}
function StatusCards(_ref2) {
  let {
    G,
    ctx,
    moves,
    playerID
  } = _ref2;
  const statusCards = [];
  for (let i = 0; i < ctx.numPlayers; i++) {
    if (isNotNullOrUndefined(G.characterID[i])) {
      statusCards.push( /*#__PURE__*/_react.default.createElement(_CustomCards.StatusCard, {
        key: i,
        name: G.characterLongName[i],
        stats: [{
          name: "Name",
          value: G.characterShortName[i]
        }, {
          name: "Cash",
          value: G.cash[i]
        }],
        health: G.health[i],
        maxHealth: G.maxHealth[i],
        drunkenness: G.drunkenness[i],
        minDrunkenness: G.minDrunkenness[i],
        playerID: i,
        moves: moves,
        liftColor: _characters.characters[G.characterID[i]].Colors[1],
        G: G,
        ctx: ctx,
        Colors: _characters.characters[G.characterID[i]].Colors,
        style: {
          height: "300px",
          width: "450px",
          minHeight: "300px",
          minWidth: "450px"
        },
        targeted: G.targetingPlayer[playerID][i]
      }));
    }
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
      backgroundColor: "#2b2b62",
      border: "5px solid #470b78",
      marginBottom: "5px"
    }
  }, statusCards);
}
function Stack(_ref3) {
  let {
    G,
    moves,
    playerID
  } = _ref3;
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      border: "5px solid #470b78",
      marginBottom: "5px",
      backgroundColor: "#a07ac3"
    }
  }, /*#__PURE__*/_react.default.createElement("h1", {
    style: {
      margin: "0px",
      textAlign: "center"
    }
  }, "Cards Played this Stage"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "left",
      flexWrap: "wrap"
    }
  }, G.stack.map((card, index) => /*#__PURE__*/_react.default.createElement(DisplayCardinStack, {
    index: index,
    cardId: card.cardId,
    playedByPlayerId: card.playedByPlayerId,
    G: G,
    moves: moves,
    playerID: playerID
  }))));
}
function DisplayCardinStack(_ref4) {
  let {
    index,
    cardId,
    playedByPlayerId,
    G,
    moves,
    playerID
  } = _ref4;
  const card = _Cards.Cards.find(card => card.id === cardId);
  const liftColor = {
    0: "#b30b02",
    1: "#215212",
    2: "#0c07ad",
    3: "#ad07ac",
    default: "#07aaad"
  }[String(playedByPlayerId)];
  return /*#__PURE__*/_react.default.createElement(_CustomCards.PersonalDeckCard, {
    float: true,
    name: card.name,
    description: card.description,
    style: {
      liftColor: liftColor
    },
    stats: [{
      name: "Playable",
      value: camelToSpaced(card.whenPlayable.join(", "))
    }, {
      name: "Type",
      value: camelToSpaced(card.playType)
    }, {
      name: "Played By",
      value: "Player " + playedByPlayerId
    }],
    trashing: false,
    moves: moves,
    index: index,
    playerID: playedByPlayerId,
    Stack: true,
    G: G,
    liftColor: liftColor,
    Colors: _characters.characters[G.characterID[playedByPlayerId]].Colors
  });
}
function Hand(_ref5) {
  let {
    G,
    ctx,
    moves,
    playerID
  } = _ref5;
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      backgroundColor: "#D2b48c",
      border: "10px double black"
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/_react.default.createElement(PhaseButtons, {
    G: G,
    ctx: ctx,
    moves: moves,
    playerID: playerID
  }), /*#__PURE__*/_react.default.createElement("h1", null, "Your hand")), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "left",
      flexWrap: "wrap"
    }
  }, Array.isArray(G.hand[playerID]) && G.hand[playerID].map((cardId, index) => /*#__PURE__*/_react.default.createElement(DisplayCardinHand, {
    key: index,
    cardId: cardId,
    playerID: playerID,
    G: G,
    index: index,
    moves: moves
  }))));
}
function PhaseButtons(_ref6) {
  let {
    G,
    ctx,
    moves,
    playerID
  } = _ref6;
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/_react.default.createElement("h1", {
    style: {
      marginRight: "10px"
    }
  }, "Stage Buttons"), ctx.activePlayers[playerID] === "Discard" && G.discarding[playerID] === false && /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => moves.startDiscarding()
  }, "Start Discarding"), ctx.activePlayers[playerID] === "Discard" && G.discarding[playerID] === true && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => moves.stopDiscarding()
  }, "Stop Discarding"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => moves.discardSelection(playerID)
  }, "Discard and Move to Draw Stage")), ctx.activePlayers[playerID] === "React" && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => moves.pass()
  }, "Pass React Stage")), ctx.activePlayers[playerID] === "Draw" && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => moves.drawToMaxHand()
  }, "Draw to Max")));
}
function DisplayCardinHand(_ref7) {
  let {
    cardId,
    playerID,
    G,
    index,
    moves
  } = _ref7;
  const card = _Cards.Cards.find(card => card.id === cardId);
  const isValid = G.handValidity[playerID][index];
  const liftColor = isValid ? "#76CC76" : "#D75265"; // replace 'green' and 'red' with actual color codes
  const playableEmoji = isValid ? "✅" : "❌";
  return /*#__PURE__*/_react.default.createElement(_CustomCards.PersonalDeckCard, {
    float: true,
    name: card.name,
    description: card.description,
    style: {
      liftColor: liftColor
    },
    stats: [{
      name: "Playable",
      value: playableEmoji + " " + camelToSpaced(card.whenPlayable.join(", "))
    }, {
      name: "Type",
      value: camelToSpaced(card.playType)
    }],
    trashing: G.discardingHand[playerID][index],
    moves: moves,
    index: index,
    playerID: playerID,
    G: G,
    Colors: _characters.characters[G.characterID[playerID]].Colors
  });
}
const CharacterSelector = props => {
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("h1", null, "Choose your character"), /*#__PURE__*/_react.default.createElement("ul", null, _characters.characters.map((character, index) => /*#__PURE__*/_react.default.createElement("li", {
    key: index
  }, /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => props.moves.chooseCharacter(index)
  }, character.shortName)))));
};
var _default = exports.default = /*#__PURE__*/_react.default.memo(CharacterSelector);
function isNotNullOrUndefined(value) {
  return value !== null && value !== undefined;
}
function camelToSpaced(str) {
  return str.replace(/([A-Z])/g, " $1") // insert a space before all found uppercase letters
  .trim(); // remove the leading space
}