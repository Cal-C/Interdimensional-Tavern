// Toaster.js
import React from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Toaster(props) {
    const { 
      G,
      playerID,
      moves, // add this prop
    } = props;
  
    // Get the active toasts for the current player
    const activeToasts = G.activeToasts[playerID];
  
    // Check if activeToasts is an array
    if (Array.isArray(activeToasts)) {
      // Iterate over activeToasts and create a toast for each one
      activeToasts.forEach((toastObj) => {
        const toastId = toastObj.id;
        let autoCloseTimeMS = toastObj.autoClose || 5000;
        let iconVar = toastObj.icon || "";
  
        // Only create a new toast if there isn't one with the same ID already displayed
        if (!toast.isActive(toastObj.id)) {
          let toastType;
          switch (toastObj.type) {
            case 'info':
              toastType = toast.info;
              break;
            case 'success':
              toastType = toast.success;
              break;
            case 'error':
              toastType = toast.error;
              break;
            case 'warn':
              toastType = toast.warn;
              autoCloseTimeMS = 10000;
              break;
            

            default:
              toastType = toast;
          }
  
          let toastOptions = {
            toastId,
            autoClose: autoCloseTimeMS,
            position: "top-center",
            closeOnClick: true,
            theme: 'colored',
            transition: Bounce, 
            onClose: () => {
              console.log(`Toast with ID ${toastObj.id} , ${iconVar} and ${toastObj.type} has been closed.`);
              // Call the move function to remove the toast
              moves.removeToast(toastObj);
            }
          };
  
  
          toastType(toastObj.message, toastOptions);
        }
      });
  
  // ...
    }
  
    return (
      <div>
        {/* This container will hold the toast notifications */}
        <ToastContainer/>
      </div>
    );
  }

export default Toaster;