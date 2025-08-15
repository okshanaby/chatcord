const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const PORT = process.env.PORT || 3000;
const botName = "ChartCord BOT";

const app = express();

const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// run when client connects
io.on("connection", socket => {
  // Welcome current user
  socket.emit("message", formatMessage(botName, "Welcome to ChartCord"));

  // Broadcast when user connects
  socket.broadcast.emit(
    "message",
    formatMessage(botName, "Another user has joined the chat")
  );

  // runs when client disconnect
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat "));
  });

  // get chat message
  socket.on("chatMessage", msg => {
    // set to every connected user
    io.emit("message", formatMessage("USER", msg));
  });
});

server.listen(PORT, () => {
  console.log("Server started at port: " + PORT);
});
