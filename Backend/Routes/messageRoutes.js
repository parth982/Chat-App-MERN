const express = require("express");
const { sendMesg, AllMesg } = require("../controllers/messgCntrs");
const jwtAuth = require("../Middleware/jwtAuthMDW");

const router = express.Router();

// Send a New Message to Particular Single or Group Chat by a User.
router.route("/").post(jwtAuth, sendMesg);

// Fetch All Messages for Particular Single or Group Chat.
router.route("/:chatId").get(jwtAuth, AllMesg);

module.exports = router;
