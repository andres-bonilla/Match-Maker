const mongoose = require("mongoose");
const { Schema } = mongoose;

const eloSchema = new Schema({
  value: {
    type: Number,
    default: 800,
  },
  league: {
    type: Schema.Types.ObjectId,
    ref: "league",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Elo = mongoose.model("elo", eloSchema);
module.exports = Elo;
