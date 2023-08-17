const Match = require("../models/Match");
const User = require("../models/Users");
const Invitation = require("../models/Invitation");
const League = require("../models/League");
const Result = require("../models/Result");

//actualizar invitations para que sean globales, no team 1, team 2

const sizeAndIdValidator = (team1, team2, res, next) => {
  if (team1 && team2 && team1.length > 0 && team2.length > 0) {
    if (team1.length !== team2.length) {
      res.status(400);
      next(new Error("Teams should be of the same size"));
      return false;
    }
    team1.concat(team2).forEach((userid) => {
      if (!userid) {
        res.status(400);
        next(new Error("Id not valid"));
        return false;
      }
    });
    return true;
  } else {
    res.status(400);
    next(new Error("Teams should have at least one participant"));
    return false;
  }
};

const repeatedValidator = (team1, team2, res, next) => {
  let i = 0;
  while (i < team1.length) {
    conditionRepeated = team2.includes(team1[i]);
    if (conditionRepeated) {
      res.status(400);
      next(new Error("User can't be in both teams at the same time"));
      return false;
    }
    i++;
  }
  return true;
};

exports.newMatch = (req, res, next) => {
  const { team_1, team_2, league, invitationText, date, time } = req.body;

  const conditionSizeAndId = sizeAndIdValidator(team_1, team_2, res, next);

  if (conditionSizeAndId) {
    const conditionRepeated = repeatedValidator(team_1, team_2, res, next);
  }

  if (conditionSizeAndId && !conditionRepeated) {
    const equipos = team_1.concat(team_2);

    Match.create({ team_1, team_2, league, invitationText, date, time }).then(
      (match) => {
        const matchId = match._id.toString();
        Result.create({ match: matchId })
          .then((result) => {
            const resultId = result._id.toString();
            match.result = resultId;
            return match.save();
          })
          .then((updatedMatch) => {
            return League.findByIdAndUpdate(
              league,
              { $push: { matches: matchId } },
              { new: true, useFindAndModify: false }
            );
          })
          .then((updatedLeague) => {
            return Promise.all(
              equipos.map((userId) => {
                return User.findByIdAndUpdate(
                  userId,
                  { $push: { matches: matchId } },
                  { new: true, useFindAndModify: false }
                );
              })
            );
          })
          .then((updatedUsers) => {
            return Promise.all(
              team_1.map((userId) =>
                Invitation.create({
                  fromId: { matchId },
                  toId: userId,
                }).then((invitation) => {
                  return Match.findByIdAndUpdate(
                    matchId,
                    {
                      $push: { invitations_team1: invitation._id.toString() },
                    },
                    { new: true, useFindAndModify: false }
                  );
                })
              )
            );
          })
          .then(() => {
            return Promise.all(
              team_2.map((userId) =>
                Invitation.create({
                  fromId: { matchId: matchId },
                  toId: userId,
                }).then((invitation) => {
                  return Match.findByIdAndUpdate(
                    matchId,
                    {
                      $push: { invitations_team2: invitation._id.toString() },
                    },
                    { new: true, useFindAndModify: false }
                  );
                })
              )
            );
          })
          .then((finalMatch) => res.send(finalMatch))
          .catch((error) => {
            res.status(400);
            next(new Error(error));
          });
      }
    );
  }
};

exports.deleteMatch = (req, res, next) => {
  const { id } = req.params;
  let matchReference;
  let canDelete;
  Match.findById(id)
    .then((match) => {
      if (match.status !== "confirmed") {
        canDelete = true;
        matchReference = match;
        const usersArray = match.team_1.concat(match.team_2);
        const promisesArray = usersArray.map((userId) => {
          return User.findByIdAndUpdate(userId, { $pull: { matches: id } });
        });
        return Promise.all(promisesArray);
      }
    })
    .then(() => {
      if (canDelete) return Invitation.deleteMany({ "fromId.matchId": id });
    })
    .then(() => {
      if (canDelete)
        return League.findByIdAndUpdate(matchReference.league, {
          $pull: { matches: id },
        });
    })
    .then(() => {
      if (canDelete) return Match.findByIdAndDelete(id);
      else {
        res.status(400);
        next(new Error("Can't delete a confirmed Match"));
      }
    })
    .then((result) => res.send(result))
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

exports.findMatch = (req, res, next) => {
  const { id } = req.params;
  Match.findById(id)
    .populate(
      { path: "league", select: "name sport description color img" },
      { path: "invitations_team1" },
      { path: "invitations_team2" }
    )
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};

exports.deleteAll = (req, res, next) => {
  Match.deleteMany()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(400);
      next(new Error(error));
    });
};


exports.cancelMatch = (matchId) => {
  return Match.findByIdAndUpdate(
    matchId,
    { status: "cancelada" },
    { new: true }
  ).then((updatedMatch) => updatedMatch);
};