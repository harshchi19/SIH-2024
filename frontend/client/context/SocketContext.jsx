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
