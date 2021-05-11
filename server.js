const express = require("express");
const http = require("http");
const socket = require("socket.io");

// App setup
const PORT = process.env.PORT || 5000;
// const index = require("./routes/index");
const app = express();
// app.use(index);
const server = http.createServer(app);
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

// Static files
app.use(express.static("public"));

// Socket setup
// const io = socket(server);
const io = socket(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    socket.leave(roomId);
  });
});

server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
