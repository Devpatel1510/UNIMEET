import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const userSocketMap = {};
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}


let io = null;

export function initSocketServer() {
  if (io) return io; 

  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    console.log("A user connected", socket.id);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
          

    socket.on("join-room", ({ roomId, userId }) => {
      userSocketMap[userId] = socket.id;
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", userId);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("offer", (payload) => {
      io.to(payload.target).emit("offer", {
        sdp: payload.sdp,
        caller: payload.caller,
      });
    });

    socket.on("answer", (payload) => {
      io.to(payload.target).emit("answer", {
        sdp: payload.sdp,
        caller: payload.caller,
      });
    });

    socket.on("ice-candidate", (incoming) => {
      io.to(incoming.target).emit("ice-candidate", {
        candidate: incoming.candidate,
        from: socket.id,
      });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
}


export function getIO() {
  if (!io) throw new Error("Socket.io not initialized. Call initSocketServer() first.");
  return io;
}

export { app, server };
