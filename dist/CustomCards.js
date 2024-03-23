"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatusCard = exports.PersonalDeckCard = void 0;
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
    hoverColor,
    onClick
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "cardBox",
    style: {
      ...style,
      "--hover-color": hoverColor
    },
    onClick: onClick
  }, children);
};
const StatusCard = props => {
  const {
    image = _tonychris.default,
    stats = [{
      Name: "Character Name",
      Cash: 69
    }],
    health = 20,
    maxHealth = 20,
    drunkenness = 1,
    minDrunkenness = 0,
    liftColor = "#540a27",
    style = {
      height: "300px",
      width: "450px",
      minHeight: "300px",
      minWidth: "450px"
    },
    G,
    ctx,
    Colors
  } = props;
  const onClick = () => {
    console.log("StatusCard " + stats.Name + " clicked. With Colors " + JSON.stringify(Colors));
  };
  let healthBarStatsLoaded = false;
  let totalHp = 20;
  let healthPercent = 100;
  let drunkennessPercent = 0;
  let bustedBy = 0;
  if (health && maxHealth && drunkenness !== null && minDrunkenness !== null) {
    totalHp = maxHealth - minDrunkenness;
    healthPercent = (maxHealth - health) / totalHp * 100;
    drunkennessPercent = drunkenness / totalHp * 100;
    if (drunkenness > health) {
      bustedBy = drunkenness - health;
    }
    healthBarStatsLoaded = true;
  }
  const statsBoarderString = "4px solid " + Colors[3];
  return /*#__PURE__*/_react.default.createElement(CardBox, {
    style: {
      ...style,
      position: "relative",
      backgroundColor: Colors[0]
    },
    hoverColor: liftColor,
    onClick: onClick
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors[0]
    }
  }, /*#__PURE__*/_react.default.createElement("img", {
    src: image,
    alt: "Character Image",
    style: {
      width: "100%",
      height: "100px",
      objectFit: "contain",
      margin: "auto",
      opacity: 0.8,
      borderBottom: "5px groove " + Colors[1],
      marginBottom: "2px",
      paddingBottom: "2px"
    }
  })), stats && /*#__PURE__*/_react.default.createElement("div", {
    style: {
      maxWidth: "95%",
      maxHeight: "124px",
      overflow: "auto"
    }
  }, /*#__PURE__*/_react.default.createElement("table", null, /*#__PURE__*/_react.default.createElement("tbody", null, /*#__PURE__*/_react.default.createElement("tr", null, stats.map((stat, index) => /*#__PURE__*/_react.default.createElement("td", {
    key: index,
    style: {
      borderLeft: statsBoarderString,
      borderTop: statsBoarderString,
      borderRight: statsBoarderString,
      textAlign: "center"
    }
  }, /*#__PURE__*/_react.default.createElement(_reactTextfit.Textfit, {
    mode: "single",
    max: 28,
    style: {
      width: "75px",
      height: "40px"
    }
  }, /*#__PURE__*/_react.default.createElement("strong", {
    style: {
      fontSize: "14px",
      textAlign: "center",
      color: Colors[2]
    }
  }, stat.name && stat.name))))), /*#__PURE__*/_react.default.createElement("tr", null, stats.map((stat, index) => /*#__PURE__*/_react.default.createElement("td", {
    key: index,
    style: {
      fontSize: "14px",
      borderLeft: statsBoarderString,
      borderBottom: statsBoarderString,
      borderRight: statsBoarderString,
      textAlign: "center"
    }
  }, " ", /*#__PURE__*/_react.default.createElement(_reactTextfit.Textfit, {
    mode: "single",
    max: 20,
    style: {
      width: "75px",
      height: "40px",
      color: Colors[2]
    }
  }, stat.value && stat.value))))))), healthBarStatsLoaded && /*#__PURE__*/_react.default.createElement("div", {
    style: {
      border: "4px inset " + Colors[1],
      margin: "5px",
      maxWidth: "95%",
      maxHeight: "30%",
      overflow: "auto",
      backgroundColor: Colors[3],
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      backgroundColor: Colors[3],
      maxWidth: "99.5%",
      maxHeight: "27%"
    }
  }, bustedBy === 0 && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      backgroundColor: Colors[1],
      width: healthPercent + "%",
      height: "50px",
      float: "left",
      marginTop: "3px",
      marginBottom: "3px",
      marginLeft: "3px"
    }
  }, /*#__PURE__*/_react.default.createElement("strong", {
    style: {
      whiteSpace: "nowrap",
      position: "absolute",
      // Add this line
      right: 90 - healthPercent / 100 * 80 + "%"
    }
  }, health)), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      backgroundColor: Colors[2],
      width: drunkennessPercent + "%",
      height: "50px",
      float: "right",
      marginTop: "3px",
      marginBottom: "2px",
      marginRight: "0"
    }
  }, /*#__PURE__*/_react.default.createElement("strong", {
    style: {
      whiteSpace: "nowrap",
      position: "absolute",
      // Add this line
      right: drunkennessPercent / 100 * 90 + 4 + "%"
    }
  }, drunkenness))), bustedBy > 0 && /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: "95%",
      height: "95%",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/_react.default.createElement(_reactTextfit.Textfit, {
    mode: "single",
    style: {
      width: "95%",
      height: "95%",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/_react.default.createElement("h1", {
    style: {
      color: Colors[2],
      textAlign: "center",
      margin: "0px",
      width: "95%",
      height: "95%",
      boxSizing: "border-box"
    }
  }, "Busted by ", bustedBy, "!"))))));
};
exports.StatusCard = StatusCard;
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
    trashing = false,
    inStack = false,
    liftColor = "InHand",
    Colors
  } = props;
  const handleClick = () => {
    if (props.G.discarding[playerID]) {
      props.moves.toggleDiscarding(index, playerID);
      return;
    }
    if (inStack) {
      //allow the player to click the card to counter it with other cards
      return;
    } else {
      props.moves.playCard(index); // replace 'moveNameWhenNotDiscarding' with the name of your move
    }
  };
  let hoverColor = liftColor;
  if (liftColor === "InHand") {
    hoverColor = colorFromPlayable(props);
  }
  const statsBoarderString = "2px dotted " + Colors[2];
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
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",
      margin: "auto",
      opacity: 0.8
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors[0]
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
      borderBottom: "5px groove " + Colors[1],
      justifyContent: "center",
      color: Colors[2]
    }
  }, /*#__PURE__*/_react.default.createElement("h1", null, name)), image && /*#__PURE__*/_react.default.createElement("img", {
    src: image,
    alt: "image",
    style: {
      border: "8px double " + Colors[2],
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
      width: "230px",
      border: "4px inset " + Colors[1],
      padding: "2px",
      margin: "5px",
      marginLeft: "7px",
      marginRight: "7px",
      color: Colors[2],
      backgroundColor: Colors[3]
    }
  }, description), stats && /*#__PURE__*/_react.default.createElement("div", {
    style: {
      maxWidth: "240px",
      maxHeight: "100px",
      overflow: "auto"
    }
  }, /*#__PURE__*/_react.default.createElement("table", {
    style: {
      width: "240px"
    }
  }, /*#__PURE__*/_react.default.createElement("tbody", null, /*#__PURE__*/_react.default.createElement("tr", null, stats.map((stat, index) => /*#__PURE__*/_react.default.createElement("td", {
    key: index,
    style: {
      borderLeft: statsBoarderString,
      borderTop: statsBoarderString,
      borderRight: statsBoarderString,
      textAlign: "center",
      width: "40px",
      height: "10px",
      maxHeight: "20px",
      maxWidth: "40px"
    }
  }, /*#__PURE__*/_react.default.createElement(_reactTextfit.Textfit, {
    mode: "single",
    max: 14,
    style: {
      width: "100%",
      height: "100%"
    }
  }, /*#__PURE__*/_react.default.createElement("strong", {
    style: {
      fontSize: "14px",
      textAlign: "center",
      color: Colors[2]
    }
  }, stat.name && stat.name))))), /*#__PURE__*/_react.default.createElement("tr", null, stats.map((stat, index) => /*#__PURE__*/_react.default.createElement("td", {
    key: index,
    style: {
      fontSize: "14px",
      borderLeft: statsBoarderString,
      borderBottom: statsBoarderString,
      borderRight: statsBoarderString,
      textAlign: "center",
      width: "40px",
      height: "20px",
      maxWidth: "40px"
    }
  }, /*#__PURE__*/_react.default.createElement(_reactTextfit.Textfit, {
    mode: "single",
    max: 14,
    style: {
      width: "95%",
      height: "100%",
      color: Colors[2]
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