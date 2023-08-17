const mongoose = require("mongoose");
const { Schema } = mongoose;

const matchSchema = new Schema({
  league: {
    type: Schema.Types.ObjectId,
    ref: "league",
  },
  team_1: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  team_2: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  invitations_team1: [
    {
      type: Schema.Types.ObjectId,
      ref: "invitation",
    },
  ],
  invitations_team2: [
    {
      type: Schema.Types.ObjectId,
      ref: "invitation",
    },
  ],
  invitationText: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  status: {
    type: String,
    default: "pendiente",
  },
  result: {
    type: Schema.Types.ObjectId,
    ref: "result",
  },
});

const Match = mongoose.model("match", matchSchema);
module.exports = Match;
