const User = require("../models/Users");
const Match = require("../models/Match");
const generateToken = require("../config/generateToken");
const jwt = require("jsonwebtoken");
const League = require("../models/League");

const {cancelMatch} = require("./matchController")

exports.register = (req, res, next) => {
  const { name, surname, nickname, email, password, age } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(400);
        next(new Error("Email already exists"));
      } else {
        User.findOne({ nickname })
          .then((user) => {
            if (user) {
              res.status(400);
              next(new Error("Nickname already exists"));
            } else {
              User.create({ name, surname, nickname, email, password, age })
                .then((user) => {
                  res.sendStatus(201);
                })
                .catch((error) => {
                  next(new Error(error));
                });
            }
          })
          .catch((error) => {
            next(new Error(error));
          });
      }
    })
    .catch((error) => {
      next(new Error(error));
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      user
        .matchPassword(password)
        .then((result) => {
          if (result) {
            res.status(200).json({
              _id: user._id,
              name: user.name,
              surname: user.surname,
              nickname: user.nickname,
              email: user.email,
              token: generateToken(user._id),
            });
          } else {
            res.status(400);
            next(new Error("Password invalid"));
          }
        })
        .catch((error) => {
          res.status(400);
          next(new Error("Password invalid"));
        });
    } else {
      User.findOne({ nickname: email }).then((user) => {
        if (user) {
          user
            .matchPassword(password)
            .then((result) => {
              if (result) {
                res.status(200).json({
                  _id: user._id,
                  name: user.name,
                  surname: user.surname,
                  nickname: user.nickname,
                  email: user.email,
                  token: generateToken(user._id),
                });
              } else {
                res.status(400);
                next(new Error("Password invalid"));
              }
            })
            .catch((error) => {
              res.status(400);
              next(new Error("Email or password invalid"));
            });
        } else {
          res.status(400);
          next(new Error("Email/Nickname or password invalid"));
        }
      });
    }
  });
};

exports.edit = (req, res, next) => {
  const { _id } = req.params;
  //const { name, surname, nickname, age, image } = req.body;
  User.updateOne({ _id }, req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

exports.changePassword = (req, res, next) => {
  const { _id } = req.params;
  const { password } = req.body;

  User.findById(_id)
    .then((user) => {
      user.password = password;
      return user.save();
    })
    .then((updatedUser) => {
      res.send(`Cambio exitoso de contraseña de ${updatedUser.nickname}`);
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

exports.logOut = (req, res, next) => {
  res.send({});
};

exports.me = (req, res, next) => {
  jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      User.findById(authData.id)
        .then((user) =>
          res.json({
            _id: user._id,
            name: user.name,
            surname: user.surname,
            nickname: user.nickname,
            leagues: user.leagues,
            img: user.img,
          })
        )
        .catch((error) => {
          res.status(400);
          next(new Error("Email/Nickname or password invalid"));
        });
    }
  });
};

exports.getLeaguesByUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .populate({ path: "leagues" })
    .then((user) => {
      res.send(user.leagues);
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

exports.getLeaguesAndRankByUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      const userLeagues = user.leagues;
      const promisesArray = userLeagues.map((leagueId) => {
        return League.findById(leagueId)
          .populate({
            path: "users",
            select: "nickname img elo",
            populate: {
              path: "elo",
              match: { league: leagueId },
              select: "value",
            },
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
              return { league, rankedUsers };
            } else {
              res.status(400);
              next(new Error("Invalid league id"));
            }
          })
          .catch((error) => {
            res.status(400);
            next(new Error(error));
          });
      });

      return Promise.all(promisesArray);
    })
    .then((leagueAndUsers) => {
      const rankedUserArray = leagueAndUsers.map((object) => {
        return {
          league: {
            _id: object.league._id,
            name: object.league.name,
            isPrivate: object.league.isPrivate,
            color: object.league.color,
            img: object.league.img,
            sport: object.league.sport,
          },
          user: object.rankedUsers.filter((user) => {
            return user._id.toString() === userId;
          })[0],
        };
      });
      res.send(rankedUserArray);
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

exports.getMatchesByUserId = (req, res, next) => {
  const { userId } = req.params;
  getUserAndMatches(userId)
    .then((user) => {
      return cancelUserMatches(user);
    })
    .then(() => {
      return getUserAndMatches(userId);
    })
    .then((user) => {
      res.send(user.matches);
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

const cancelUserMatches = (userAndMatches) => {
  const canceledMatches = userAndMatches.matches.filter(
    (match) => !match.invitations_team1[0]
  );
  return Promise.all(
    canceledMatches.map((cancelledMatch) => {
      return cancelMatch(cancelledMatch._id.toString());
    })
  );
};

const getUserAndMatches = (userId, matchParams = {}) => {
  return User.findById(userId).populate({
    path: "matches",
    populate: [
      { path: "team_1", select: "nickname" },
      { path: "team_2", select: "nickname" },
      { path: "invitations_team1" },
      { path: "invitations_team2" },
    ],
    match: matchParams,
  });
};

exports.getUserMatchesByDate = (req, res, next) => {
  const { userId, date } = req.params;
  getUserAndMatches(userId, { date })
    .then((user) => {
      return cancelUserMatches(user);
    })
    .then(() => {
      return getUserAndMatches(userId, {date});
    })
    .then((user) => res.send(user.matches))
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
    next(new Error("Invalid token"));
  }
};
