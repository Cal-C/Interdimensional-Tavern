"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PersonalDeckCard = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactTextfit = require("react-textfit");
var _tonychris = _interopRequireDefault(require("./images/tonychris.jpg"));
var _trashcan = _interopRequireDefault(require("./images/trashcan.png"));
require("./CustomCards.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CardBox = _ref => {
  let {
    children,
    style,
    hoverColor
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "cardBox",
    style: {
      ...style,
      '--hover-color': hoverColor
    }
  }, children);
};
const PersonalDeckCard = props => {
  const {
    name,
    playerID,
    description,
    stats,
    index,
    image = _tonychris.default,
    style = {
      height: "500px",
      width: "250px",
      minHeight: "500px",
      minWidth: "250px"
    },
    // default values for height and width
    trashing = false
  } = props;
  const handleClick = () => {
    if (props.G.discarding[props.playerID]) {
      console.log("Discarding" + index);
      props.moves.toggleDiscarding(index, playerID); // replace 'moveNameWhenDiscarding' with the name of your move
    } else {
      props.moves.playCard(index, playerID); // replace 'moveNameWhenNotDiscarding' with the name of your move
    }
  };
  const hoverColor = colorFromPlayable(props);
  return /*#__PURE__*/_react.default.createElement(CardBox, {
    style: {
      ...style,
      position: "relative"
    },
    hoverColor: hoverColor,
    onClick: handleClick
  }, trashing && /*#__PURE__*/_react.default.createElement("img", {
    src: _trashcan.default,
    alt: "Trashcan",
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      margin: 'auto',
      opacity: 0.8
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#a06b2d"
    }
  }, /*#__PURE__*/_react.default.createElement(_reactTextfit.Textfit, {
    mode: "single",
    max: 10,
    style: {
      alignItems: "center",
      display: "flex",
      width: "225px",
      maxHeight: "35px",
      textAlign: "center",
      borderBottom: "5px solid purple",
      justifyContent: "center"
    }
  }, /*#__PURE__*/_react.default.createElement("h1", null, name)), image && /*#__PURE__*/_react.default.createElement("img", {
    src: image,
    alt: "image",
    style: {
      border: "8px double black",
      maxWidth: "80%",
      height: "200px",
      marginTop: "5px"
    }
  }), description && /*#__PURE__*/_react.default.createElement(_reactTextfit.Textfit, {
    mode: "multi",
    max: 25,
    style: {
      flex: 1,
      minHeight: "150px",
      height: "150px",
      maxHeight: "150px",
      width: "240px",
      border: "8px double black",
      marginLeft: "10px",
      marginRight: "10px"
    }
  }, description), stats && /*#__PURE__*/_react.default.createElement("div", {
    style: {
      maxWidth: "225px",
      maxHeight: "100px",
      overflow: "auto"
    }
  }, /*#__PURE__*/_react.default.createElement("table", null, /*#__PURE__*/_react.default.createElement("tbody", null, /*#__PURE__*/_react.default.createElement("tr", null, stats.map((stat, index) => /*#__PURE__*/_react.default.createElement("td", {
    key: index,
    style: {
      borderLeft: "2px dotted black",
      borderTop: "2px dotted black",
      borderRight: "2px dotted black",
      textAlign: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_reactTextfit.Textfit, {
    mode: "single",
    max: 14,
    style: {
      width: "75px",
      height: "20px"
    }
  }, /*#__PURE__*/_react.default.createElement("strong", {
    style: {
      fontSize: "14px",
      textAlign: 'center'
    }
  }, stat.name && stat.name))))), /*#__PURE__*/_react.default.createElement("tr", null, stats.map((stat, index) => /*#__PURE__*/_react.default.createElement("td", {
    key: index,
    style: {
      fontSize: "14px",
      borderLeft: "2px dotted black",
      borderBottom: "2px dotted black",
      borderRight: "2px dotted black",
      textAlign: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_reactTextfit.Textfit, {
    mode: "single",
    max: 14,
    style: {
      width: "75px",
      height: "20px"
    }
  }, stat.value && stat.value)))))))));
};
exports.PersonalDeckCard = PersonalDeckCard;
function colorFromPlayable(props) {
  const playableString = props.stats.find(stat => stat.name === "Playable").value;
  if (playableString.includes("✅")) {
    return "green";
  } else {
    return "red";
  }
}