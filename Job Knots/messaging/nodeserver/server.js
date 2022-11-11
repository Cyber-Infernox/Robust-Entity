// node server which will handle socket io connections
const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const users = {};
// when user joins
io.on("connection", (socket) => {
  socket.on("new-user-joined", (username) => {
    console.log("new-user", username);
    users[socket.id] = username;
    socket.broadcast.emit("user-joined", username);
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("recieve", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
