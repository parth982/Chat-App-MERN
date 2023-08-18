const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const data = require("./data/data.js");
const bodyParser = require("body-parser");
const connectDB = require("./config/connectDB.js");
const userRoutes = require("./Routes/userRoutes.js");
const chatRoutes = require("./Routes/chatRoutes.js");
const messageRoutes = require("./Routes/messageRoutes.js");
const { notFound, errorHandler } = require("./Middleware/errorMDW.js");

app.use(cors());
app.use(bodyParser.json());
dotenv.config();
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: ", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMesgReceived) => {
    var chat = newMesgReceived.chat;

    chat.users.forEach((user) => {
      if (user._id !== newMesgReceived.sender._id) {
        socket.in(user._id).emit("Message Received", newMesgReceived);
      }
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
