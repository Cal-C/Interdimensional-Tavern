// Toaster.js
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
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
      activeToasts.forEach((toastObj, index) => {
        
        const toastId = toastObj.id;
  
        // Only create a new toast if there isn't one with the same ID already displayed
        if (!toast.isActive(toastObj.id)) {
          toast(toastObj.message, {
            toastId,
            onClose: () => {
              console.log(`Toast with ID ${toastObj.id} has been closed.`);
              // Call the move function to remove the toast
              moves.removeToast(toastObj);
            }
          });
          console.log("toasting " + toastObj.message);
        }
      });
    }
  
    return (
      <div>
        {/* This container will hold the toast notifications */}
        <ToastContainer />
      </div>
    );
  }

export default Toaster;