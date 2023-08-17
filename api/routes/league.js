const express = require("express");
const router = express.Router();
const leagueController = require("../controllers/leagueController");
const userController = require("../controllers/userController");

router.get("/getAll/private/:isPrivate", leagueController.getAll);

router.post("/new", leagueController.new);

router.put(
  "/:leagueId/addUser/:userId",
//   userController.verifyToken,
  leagueController.addUser
);

router.put(
  "/:leagueId/deleteUser/:userId",
  userController.verifyToken,
  leagueController.deleteUser
);

router.get("/getUsers/:leagueId", leagueController.getUserByLeagueId);

router.delete(
  "/deleteLeague/:id",
  // userController.verifyToken,
  leagueController.deleteLeague
);

router.get("/showLeague/:id", leagueController.findShowLeague);

router.put(
  "/editLeague/:id",
  userController.verifyToken,
  leagueController.editLeague
);

router.get("/findLeague/:leagueName", leagueController.findLeagueByName);

router.get("/showHistory/:leagueId", leagueController.showHistoryLeague);

module.exports = router;
