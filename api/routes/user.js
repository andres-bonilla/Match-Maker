const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")

router.post("/register", userController.register);

router.post("/login", userController.login);

router.put("/edit/:_id", userController.verifyToken ,userController.edit);

router.put("/changePassword/:_id", userController.verifyToken ,userController.changePassword);

router.post("/logout", userController.logOut)

router.get("/getLeagues/:userId", userController.getLeaguesByUserId)

router.get("/getLeaguesAndRank/:userId", userController.getLeaguesAndRankByUserId)

router.get("/getMatches/:userId", userController.getMatchesByUserId)

// router.post("/check", verifyToken, (req, res) => {
//   jwt.verify(req.token, "secretkey", (err, authData) => {
//     if (err) {
//       res.sendStatus(403);
//     } else {
//       res.json({
//         mensaje: "token fue creado",
//         authData: authData,
//       });
//     }
//   });
// });

router.get("/:userId/getMatchesByDate/:date", userController.getUserMatchesByDate);

router.post("/me", userController.verifyToken, userController.me);

module.exports = router;
