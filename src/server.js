const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:1234",
  },
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
});

httpServer.listen(5000);
