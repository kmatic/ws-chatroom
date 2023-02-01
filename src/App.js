import React from "react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:5000");

const App = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });
  }, []);

  return <div>Hello</div>;
};

export default App;
