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

const users = {};

io.on("connection", (socket) => {
    socket.on("username-provided", (username) => {
        const user = {
            id: socket.id,
            name: username,
        };

        users[socket.id] = user;
        io.emit("connected", Object.values(users));
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("disconnected", socket.id);
    });

    socket.on("message-sent", (message) => {
        const msg = {
            message: message,
            user: users[socket.id],
            date: new Date().toISOString(),
        };

        io.emit("message-received", msg);
    });
});

httpServer.listen(5000);
