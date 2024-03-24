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
    activeToasts.forEach((toastMessage, index) => {
      const now = new Date();

      // Extract the hours, minutes, seconds, and milliseconds
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Create a unique ID for each toast based on its message and the current time
      const toastId = "".concat(toastMessage, "-").concat(index, "-").concat(seconds);

      // Only create a new toast if there isn't one with the same ID already displayed
      if (!_reactToastify.toast.isActive(toastId)) {
        (0, _reactToastify.toast)(toastMessage, {
          toastId,
          onClose: () => {
            console.log("Toast with ID ".concat(toastId, " has been closed."));
            // Call the move function to remove the toast
            moves.removeToast(toastMessage);
          }
        });
        console.log("toasting " + toastMessage);
      }
    });
  }
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_reactToastify.ToastContainer, null));
}
var _default = exports.default = Toaster;