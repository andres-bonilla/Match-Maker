const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name"],
  },
  surname: {
    type: String,
    required: [true, "Please enter your Surname"],
  },
  nickname: {
    type: String,
    unique: true,
    required: [true, "Please enter your Nickname"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Please enter Email Address"],
    match: [/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, "Please enter a valid email"]
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Please enter a password"],
    minlength: [8, "Password must be at least 8 characters"],
    match: [/^(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,}).{8,}$/, "Password must have one uppercase and one number"]
  },
  age: {
    type: Number,
    required: [true, "Please enter your age"],
  },
  img: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2017/02/23/13/05/profile-2092113_960_720.png"
  },
  leagues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "league",
    },
  ],
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "match",
    },
  ],
  elo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "elo",
    },
  ],
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(16);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/*var validateEmail = function(email) {
  var re = `/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/`;
  return re.test(email)
};*/

const User = mongoose.model("user", userSchema);
module.exports = User;
