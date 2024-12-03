// "use client";
// import { useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import { HOST } from "@/utils/constants";

// const useSocket = (userId) => {
//   const socket = useRef(null);

//   useEffect(() => {
//     // Ensure userId is valid
//     if (!userId) {
//       console.error("User ID is required to establish socket connection");
//       return;
//     }

//     // Log for debugging
//     console.log(`Establishing socket connection for userId: ${userId}`);

//     // Check if socket already exists for this user
//     if (!socket.current) {
//       socket.current = io(HOST, {
//         query: { userId },
//       });

//       socket.current.on("connect", () => {
//         console.log("Connected to socket server:", socket.current.id);
//       });

//       // socket.current.on("recieveMessage", (message) => {
//       //   // Handle incoming message
//       //   setMessages((prevMessages) => [...prevMessages, message]);
//       //   // console.log("Message received:", message);
//       // });

//       socket.current.on("connect_error", (err) => {
//         console.error("Socket connection error:", err);
//       });

//       socket.current.on("disconnect", () => {
//         console.log("Disconnected from socket server");
//       });

//       socket.current.on("reconnect_attempt", () => {
//         console.log("Attempting to reconnect...");
//       });

//       socket.current.on("reconnect_failed", () => {
//         console.error("Reconnection failed");
//       });
//     }

//     // Cleanup when component unmounts or userId changes
//     return () => {
//       if (socket.current) {
//         socket.current.disconnect();
//         console.log("Socket connection closed");
//         socket.current = null; // Reset the socket reference
//       }
//     };
//   }, [userId]); // Trigger the effect when userId changes

//   return socket.current;
// };

// export default useSocket;

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { HOST } from "@/utils/constants";

let socketInstance = null; // Singleton to store the socket instance

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user");

    if (!userId) {
      console.error("User ID is required to establish socket connection");
      return;
    }

    // Create socket instance if it doesn't exist (Singleton)
    if (!socketInstance) {
      socketInstance = io(HOST, {
        query: { userId },
        autoConnect: false, // Prevent auto-reconnection loops
      });

      socketInstance.connect(); // Explicitly connect the socket

      // Listen for socket events
      socketInstance.on("connect", () => {
        console.log("Connected to socket server:", socketInstance.id);
        setSocketId(socketInstance.id); // Set the socket ID
        setConnected(true);
        localStorage.setItem("socketId", socketInstance.id); // Store in local storage
      });

      socketInstance.on("disconnect", () => {
        console.log("Disconnected from socket server");
        setConnected(false);
      });
    }

    return () => {
      // Don't destroy socketInstance on unmount
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: socketInstance, connected, socketId }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
