const mongoose = require("mongoose");
const { Schema } = mongoose;

const resultSchema = new Schema({
  score_1: {
    type: String,
  },
  score_2: {
    type: String,
  },
  confirmation_1: {
    type: Boolean,
    required: [true, "Please, team 1 confirm the result"],
    default: false,
  },
  confirmation_2: {
    type: Boolean,
    required: [true, "Please, team 2 confirm the result"],
    default: false,
  },
  match: {
    type: Schema.Types.ObjectId,
    ref: "match",
  },
});

const Result = mongoose.model("result", resultSchema);
module.exports = Result;
