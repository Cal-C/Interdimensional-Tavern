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
    activeToasts.forEach(toastObj => {
      const toastId = toastObj.id;
      let autoCloseTimeMS = toastObj.autoClose || 5000;
      let iconVar = toastObj.icon || "";

      // Only create a new toast if there isn't one with the same ID already displayed
      if (!_reactToastify.toast.isActive(toastObj.id)) {
        let toastType;
        switch (toastObj.type) {
          case 'info':
            toastType = _reactToastify.toast.info;
            break;
          case 'success':
            toastType = _reactToastify.toast.success;
            break;
          case 'error':
            toastType = _reactToastify.toast.error;
            break;
          case 'warn':
            toastType = _reactToastify.toast.warn;
            autoCloseTimeMS = 10000;
            break;
          default:
            toastType = _reactToastify.toast;
        }
        let toastOptions = {
          toastId,
          autoClose: autoCloseTimeMS,
          position: "top-center",
          closeOnClick: true,
          theme: 'colored',
          transition: _reactToastify.Bounce,
          onClose: () => {
            console.log("Toast with ID ".concat(toastObj.id, " , ").concat(iconVar, " and ").concat(toastObj.type, " has been closed."));
            // Call the move function to remove the toast
            moves.removeToast(toastObj);
          }
        };
        toastType(toastObj.message, toastOptions);
      }
    });

    // ...
  }
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_reactToastify.ToastContainer, null));
}
var _default = exports.default = Toaster;