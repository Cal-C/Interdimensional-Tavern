"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _react2 = require("boardgame.io/react");
var _Game = require("./Game.js");
var _multiplayer = require("boardgame.io/multiplayer");
var _board = require("./board.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
//import { Card, CardWrapper } from 'react-ui-cards';

// Define your game rules

// Create a client
const GameClient = (0, _react2.Client)({
  game: _Game.iTavernGame,
  multiplayer: (0, _multiplayer.SocketIO)({
    server: 'localhost:8080'
  }),
  board: _board.TavernBoard
});
function App() {
  const [selectedPlayerID, setSelectedPlayerID] = (0, _react.useState)(null);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "App"
  }, /*#__PURE__*/_react.default.createElement("h1", {
    style: {
      color: "#9d5e2b",
      backgroundColor: "#4d2204",
      textAlign: "center",
      border: "5px offset #170d05",
      textShadow: "0 0 3px #77d778, 0 0 10px #77d778",
      fontFamily: "Copperplate, fantasy,"
    }
  }, "Interdimensional Tavern"), selectedPlayerID === null ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => setSelectedPlayerID('0')
  }, "Select Player 0"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => setSelectedPlayerID('1')
  }, "Select Player 1"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => setSelectedPlayerID('2')
  }, "Select Player 2"), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => setSelectedPlayerID('3')
  }, "Select Player 3")) : /*#__PURE__*/_react.default.createElement(GameClient, {
    playerID: selectedPlayerID
  }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("small", null, "Coding and Game Design by Cal Crompton| Trashcan art by Ilham Fitrotul Hayat | Target by Tomas Knop"));
}
var _default = exports.default = App;