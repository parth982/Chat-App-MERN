const express = require("express");
const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controllers/userCntrs");
const jwtAuth = require("../Middleware/jwtAuthMDW");

const router = express.Router();

router.route("/register").post(registerUser);
router.post("/login", loginUser);
// Get all Users As Per Seacrh Query Parameters.
router.route("/").get(jwtAuth, allUsers);

module.exports = router;
