const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatCntrs");
const jwtAuth = require("../Middleware/jwtAuthMDW");

const router = express.Router();

// Fetch Chat Between 2 Users, if Not Exists then create one & then send.
router.route("/").post(jwtAuth, accessChat);

// Fetch All Chats for a Logged In User.
router.route("/").get(jwtAuth, fetchChats);

// Create a new Group Chat
router.route("/createGroup").post(jwtAuth, createGroupChat);

// Rename a Group Chat
router.route("/renameGroup").put(jwtAuth, renameGroup);

// Add User to a Group Chat
router.route("/addToGroup").put(jwtAuth, addToGroup);

// Remove User from Group Chat
router.route("/removeFromGroup").put(jwtAuth, removeFromGroup);

module.exports = router;
