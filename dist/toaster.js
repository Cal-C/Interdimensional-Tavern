"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactToastify = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// Toaster.js

function Toaster(props) {
  const {
    G,
    playerID,
    moves // add this prop
  } = props;

  // Get the active toasts for the current player
  const activeToasts = G.activeToasts[playerID];

  // Check if activeToasts is an array
  if (Array.isArray(activeToasts)) {
    // Iterate over activeToasts and create a toast for each one
    activeToasts.forEach((toastObj, index) => {
      const toastId = toastObj.id;

      // Only create a new toast if there isn't one with the same ID already displayed
      if (!_reactToastify.toast.isActive(toastObj.id)) {
        (0, _reactToastify.toast)(toastObj.message, {
          toastId,
          onClose: () => {
            console.log("Toast with ID ".concat(toastObj.id, " has been closed."));
            // Call the move function to remove the toast
            moves.removeToast(toastObj);
          }
        });
        console.log("toasting " + toastObj.message);
      }
    });
  }
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_reactToastify.ToastContainer, null));
}
var _default = exports.default = Toaster;