// "use client";
// import { useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import { HOST } from "@/utils/constants";

// const useSocket = (userId) => {
//   const socket = useRef(null);

//   useEffect(() => {
//     if (!userId) {
//       console.error("Usr ID is required to establish socket connection");
//       return;
//     }
//     console.log(HOST);
//     socket.current = io(HOST, {
//       query: { userId },
//       //   withCredentials: true,
//     });

//     socket.current.on("connect", () => {
//       console.log("Connected to socket server:", socket.current.id);
//     });

//     const handleRecieveMessage = (message) => {};

//     socket.current.on("recieveMessage", handleRecieveMessage);
//     socket.current.on("connect_error", (err) => {
//       console.error("Socket connection error:", err);
//     });

//     socket.current.on("disconnect", () => {
//       console.log("Disconnected from socket server");
//     });

//     socket.current.on("reconnect_attempt", () => {
//       console.log("Attempting to reconnect...");
//     });

//     socket.current.on("reconnect_failed", () => {
//       console.error("Reconnection failed");
//     });

//     return () => {
//       socket.current.disconnect();
//       console.log("Socket connection closed");
//     };
//   }, [userId]);

//   return socket.current;
// };

// export default useSocket;

"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { HOST } from "@/utils/constants";

const useSocket = (userId) => {
  const socket = useRef(null);

  useEffect(() => {
    // Ensure userId is valid
    if (!userId) {
      console.error("User ID is required to establish socket connection");
      return;
    }

    // Log for debugging
    console.log(`Establishing socket connection for userId: ${userId}`);

    // Check if socket already exists for this user
    if (!socket.current) {
      socket.current = io(HOST, {
        query: { userId },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server:", socket.current.id);
      });

      // socket.current.on("recieveMessage", (message) => {
      //   // Handle incoming message
      //   setMessages((prevMessages) => [...prevMessages, message]);
      //   // console.log("Message received:", message);
      // });

      socket.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      socket.current.on("reconnect_attempt", () => {
        console.log("Attempting to reconnect...");
      });

      socket.current.on("reconnect_failed", () => {
        console.error("Reconnection failed");
      });
    }

    // Cleanup when component unmounts or userId changes
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        console.log("Socket connection closed");
        socket.current = null; // Reset the socket reference
      }
    };
  }, [userId]); // Trigger the effect when userId changes

  return socket.current;
};

export default useSocket;
