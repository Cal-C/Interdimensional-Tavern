"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PersonalDeckCard = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactTextfit = require("react-textfit");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const CardBox = _ref => {
  let {
    children,
    style
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      color: 'black',
      wordWrap: 'break-word',
      borderRadius: "10px",
      ...style
    }
  }, children);
};
const PersonalDeckCard = props => {
  const {
    name,
    playerID,
    description,
    stats,
    avatar = '../images/tonychris.jpg',
    style = {
      height: '400px',
      width: '250px'
    } // default values for height and width
  } = props;
  return /*#__PURE__*/_react.default.createElement(CardBox, {
    style: style
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_reactTextfit.Textfit, {
    mode: "single",
    max: 10,
    style: {
      width: "225px",
      maxHeight: "35px",
      textAlign: "center"
    }
  }, /*#__PURE__*/_react.default.createElement("h1", null, name)), avatar && /*#__PURE__*/_react.default.createElement("img", {
    src: avatar,
    alt: "avatar",
    style: {
      maxWidth: '100%',
      height: "250px"
    }
  }), description && /*#__PURE__*/_react.default.createElement(_reactTextfit.Textfit, {
    mode: "multi",
    style: {
      flex: 1,
      height: '200px',
      width: '225px'
    }
  }, description), stats && /*#__PURE__*/_react.default.createElement(_reactTextfit.Textfit, {
    mode: "multi",
    style: {
      width: '250px',
      height: '100px',
      overflow: 'auto'
    }
  }, stats.map((stat, index) => /*#__PURE__*/_react.default.createElement("div", {
    key: index
  }, /*#__PURE__*/_react.default.createElement("strong", null, stat.name && stat.name), ": ", stat.value && stat.value)))));
};
exports.PersonalDeckCard = PersonalDeckCard;