const League = require("../models/League");
const User = require("../models/Users");
const Match = require("../models/Match");
const Elo = require("../models/Elo");

exports.new = (req, res, next) => {
  const { name, sport, description, isPrivate, secretKey, color, img, admin } =
    req.body;
  let newLeagueRef;
  if (isPrivate && !secretKey) {
    res.status(400);
    next(new Error("A private league must have a secret key"));
  } else {
    League.findOne({ name })
      .then((league) => {
        if (league) {
          res.status(400);
          next(new Error("League Already Exists"));
        } else {
          return League.create({
            name,
            sport,
            description,
            isPrivate,
            secretKey,
            color,
            img,
            admin,
            users: admin,
          });
        }
      })
      .then((league) => {
        if (league) {
          newLeagueRef = league;
          return Elo.create({ league: league._id.toString(), user: admin });
        }
      })
      .then((elo) => {
        if (elo) {
          return User.findByIdAndUpdate(
            admin,
            {
              $push: {
                leagues: newLeagueRef._id.toString(),
                elo: elo._id.toString(),
              },
            },
            { new: true, useFindAndModify: false }
          );
        }
      })
      .then((updatedUser) => {
        res.status(201).send(newLeagueRef);
      })
      .catch((error) => {
        next(new Error(error));
      });
  }
};

exports.addUser = (req, res, next) => {
  const { leagueId, userId } = req.params;
  const { enteredKey } = req.body;
  let updatedLeague = {};
  League.findById(leagueId)
    .then((league) => {
      if (!league) {
        res.status(400);
        next(new Error("Invalid leagueId or userId"));
        return false;
      } else if (league.users.includes(userId)) {
        res.status(400);
        next(new Error("User is already in the league"));
        return "already";
      }
      if (league.isPrivate) {
        return league.matchSecretKey(enteredKey);
      } else return true;
    })
    .then((isValid) => {
      if (isValid === true) {
        return League.findByIdAndUpdate(
          leagueId,
          { $push: { users: userId } },
          { new: true, useFindAndModify: false }
        );
      } else if (isValid === "already") {
        return false;
      } else {
        res.status(400);
        // res.send("Invalid SecretKey")
        next(new Error("Invalid SecretKey"));
        return false;
      }
    })
    .then((league) => {
      if (league) {
        updatedLeague = league;
        return Elo.create({ league: leagueId, user: userId });
      }
    })
    .then((elo) => {
      if (elo) {
        const eloId = elo._id.toString();
        return User.findByIdAndUpdate(
          userId,
          { $push: { leagues: leagueId, elo: eloId } },
          { new: true, useFindAndModify: false }
        );
      }
    })
    .then((updatedUser) => {
      if (updatedLeague) {
        if (updatedLeague._id) {
          res.send(updatedLeague);
        }
      }
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

exports.deleteUser = (req, res, next) => {
  const { leagueId, userId } = req.params;
  League.findByIdAndUpdate(
    leagueId,
    { $pull: { users: userId } },
    { new: true }
  )
    .then((updatedLeague) => {
      return User.findByIdAndUpdate(
        userId,
        { $pull: { leagues: leagueId } },
        { new: true }
      );
    })
    .then((updatedUser) => {
      return Elo.findOne({ user: userId, league: leagueId });
    })
    .then((elo) => {
      return User.findByIdAndUpdate(
        userId,
        { $pull: { elo: elo._id } },
        { new: true }
      );
    })
    .then(() => {
      return Elo.findOneAndDelete({ user: userId, league: leagueId });
    })
    .then(() => {
      res.send("delete elo success");
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

exports.getUserByLeagueId = (req, res, next) => {
  const { leagueId } = req.params;
  if (leagueId) {
    League.findById(leagueId)
      .populate({
        path: "users",
        select: "nickname img elo",
        populate: { path: "elo", match: { league: leagueId }, select: "value" },
      })
      .then((league) => {
        if (league.users) {
          const leagueUsers = league.users;
          leagueUsers.sort((a, b) => {
            if (a["elo"][0] && b["elo"][0]) {
              return a["elo"]["0"]["value"] > b["elo"]["0"]["value"]
                ? -1
                : b["elo"]["0"]["value"] > a["elo"]["0"]["value"]
                ? 1
                : 0;
            } else if (!a["elo"][0] && b["elo"][0]) return 1;
            else if (!b["elo"][0] && a["elo"][0]) return -1;
          });
          const rankedUsers = leagueUsers.map((user, i) => {
            return { rank: i + 1, ...user._doc };
          });
          res.send({ league, rankedUsers });
        } else {
          res.status(400);
          next(new Error("Invalid league id"));
        }
      })
      .catch((error) => {
        res.status(400);
        next(new Error("An error ocurred"));
      });
  } else {
    res.status(400);
    next(new Error("Please enter a league id"));
  }
};

exports.deleteLeague = (req, res, next) => {
  const { id } = req.params;
  League.deleteOne({ _id: id })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

//get league by id
exports.findShowLeague = (req, res, next) => {
  const { id } = req.params;
  if (id) {
    League.findById(id)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        res.status(400);
        next(new Error(error));
      });
  } else {
    res.status(400);
    next(new Error("Please enter a league id"));
  }
};

//dividir get all en privadas y publicas
exports.getAll = (req, res, next) => {
  const { isPrivate } = req.params;
  League.find({ isPrivate: isPrivate === "true" })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

exports.editLeague = (req, res, next) => {
  const { id } = req.params;
  const { name, description, users } = req.body;
  League.updateOne(
    { name: name, description: description, users: users },
    { where: id }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

exports.showHistoryLeague = (req, res, next) => {
  const { leagueId } = req.params;
  League.findById(leagueId)
    .then((league) => {
      Match.find({ _id: { $in: league.matches } }).then((users) => {
        res.send(users);
      });
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

exports.findLeagueByName = (req, res, next) => {
  const { leagueName } = req.params;
  if (leagueName) {
    const cleanedName = leagueName
      .trim()
      .split(" ")
      .filter((el) => el !== "");
    let reg = "";
    if (cleanedName.length > 1) {
      reg = cleanedName.join("|");
      reg = "(" + reg + ")";
    } else {
      reg = cleanedName.join("");
    }
    const searchReg = new RegExp(reg, "i");
    League.find({ name: { $regex: searchReg } })
      // .select("name")
      .then((leagues) => {
        res.send(leagues);
      })
      .catch((error) => {
        res.status(400);
        next(new Error(error));
      });
    // League.find({ $text : { $search: `'${leagueName}'`, $caseSensitive:false } })
    // .then((result) => {
    //   console.log(result);
    // res.send(result);
    // });
  } else {
    res.status(400);
    next(new Error(error));
  }
};
