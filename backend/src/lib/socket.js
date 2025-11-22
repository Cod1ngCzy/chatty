import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const websocket = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.5.136:5173"]
  },
});

export function getReceiverSocketId(userId){
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}


websocket.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // emit is used to send events to all the connected clients
    websocket.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        delete userSocketMap[userId];
        websocket.emit("getOnlineUsers", Object.keys(userSocketMap))
    });
});

export {websocket, app, server};