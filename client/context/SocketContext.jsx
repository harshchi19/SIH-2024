"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { HOST } from "@/utils/constants";

const useSocket = () => {
  const socket = useRef(null);

  useEffect(() => {
    console.log(HOST);
    socket.current = io(HOST, {
      //   withCredentials: true,
    });

    socket.current.on("connect", () => {
      console.log("Connected to socket server:", socket.current.id);
    });

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

    return () => {
      socket.current.disconnect();
      console.log("Socket connection closed");
    };
  }, []);

  return socket.current;
};

export default useSocket;
