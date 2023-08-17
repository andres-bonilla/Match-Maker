const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");
const userController = require("../controllers/userController");

router.post("/newMatch", matchController.newMatch);

router.delete(
  "/deleteMatch/:id",
//   userController.verifyToken,
  matchController.deleteMatch
);

router.get("/showMatch/:id", matchController.findMatch);

router.delete(
  "/deleteAll",
  userController.verifyToken,
  matchController.deleteAll
);

module.exports = router;
