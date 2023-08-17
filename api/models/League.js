const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const leagueSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
  },
  description: String,
  isPrivate: {
    type: Boolean,
    default: false,
  },
  secretKey: {
    type: String,
    match: [
      /^(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,}).{5}$/,
      "Secret key must have one uppercase and one number and be 5 characters long",
    ],
    validate: {
      validator: function () {
        return this.isPrivate;
      },
      message: (props) =>
        `A secret key can only be created if the match is private`,
    },
  },
  color: {
    type: String,
    default: "#5bc11c",
  },
  img: {
    type: String,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "match",
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

leagueSchema.pre("save", async function () {
  if (this.secretKey) {
    const salt = await bcrypt.genSalt(10);
    this.secretKey = await bcrypt.hash(this.secretKey, salt);
  }
});

leagueSchema.methods.matchSecretKey = async function (enteredSecretKey) {
  return await bcrypt.compare(enteredSecretKey, this.secretKey);
};

const League = mongoose.model("league", leagueSchema);
module.exports = League;
