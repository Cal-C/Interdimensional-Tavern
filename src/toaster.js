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
      activeToasts.forEach((toastMessage, index) => {
        
        const now = new Date();
  
        // Extract the hours, minutes, seconds, and milliseconds
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
  
        // Create a unique ID for each toast based on its message and the current time
        const toastId = `${toastMessage}-${index}-${seconds}`;
  
        // Only create a new toast if there isn't one with the same ID already displayed
        if (!toast.isActive(toastId)) {
          toast(toastMessage, {
            toastId,
            onClose: () => {
              console.log(`Toast with ID ${toastId} has been closed.`);
              // Call the move function to remove the toast
              moves.removeToast(toastMessage);
            }
          });
          console.log("toasting " + toastMessage);
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