const Invitation = require("../models/Invitation");
const Match = require("../models/Match");
const {cancelMatch} = require("./matchController")

exports.deleteAll = (req, res, next) => {
  Invitation.deleteMany()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      next(new Error(error));
    });
};

exports.matchInvitationAcepted = (req, res, next) => {
  const { matchId, userId } = req.params;
  Invitation.findOneAndUpdate(
    {
      $and: [{ "fromId.matchId": matchId }, { toId: userId }],
    },
    { status: "accepted" }, {new: true}
  )
    .then((updatedInvitation) => {
      return Match.findById(matchId).populate([
        { path: "invitations_team1" },
        { path: "invitations_team2" },
      ]);
    })
    .then((match) => {
      let acceptedNumber = 0
      const invitationsArray = match["invitations_team1"].concat(
        match["invitations_team2"]
      );
      invitationsArray.forEach(invitation => {
        if(invitation.status ==="accepted") acceptedNumber++
      })
      if(acceptedNumber === invitationsArray.length) {
        return Match.findByIdAndUpdate(matchId, {status: "lista"}, {new: true})
      }
      else {
       return match
      }
    }).then(result=>res.send(result))
    .catch((error) => {
      next(new Error(error));
    });
};

exports.invitationRejected = (req, res, next) => {
  const { matchId, userId } = req.params;
  return Invitation.findOneAndUpdate(
    {
      $and: [{ "fromId.matchId": matchId }, { toId: userId }],
    },
    { status: "rejected" }, {new: true}
  )
    .then(() => {
      return cancelMatch(matchId)
    })
    .then(updatedMatch=>res.send(updatedMatch))
    .catch((error) => {
      next(new Error(error));
    });
};
