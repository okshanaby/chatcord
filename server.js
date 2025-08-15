const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const PORT = process.env.PORT || 3001;
const botName = "ChartCord BOT";

const app = express();

const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// run when client connects
io.on("connection", socket => {
  // User join chat room
  socket.on("joinChatRoom", ({ username, room }) => {
    const user = joinUser(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChartCord"));

    // Broadcast when user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // send room info
    io.to(user.room).emit("roomInfo", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // get chat message
  socket.on("chatMessage", msg => {
    const user = getCurrentUser(socket.id);
    // set to every connected user
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // runs when client disconnect
  socket.on("disconnect", () => {
    const user = getCurrentUser(socket.id);

    userLeave(socket.id);
    
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username}  has left the chat `)
      );

      // send room info
      io.to(user.room).emit("roomInfo", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log("Server started at port: " + PORT);
});
