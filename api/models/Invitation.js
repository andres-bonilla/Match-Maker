const mongoose = require("mongoose");
const { Schema } = mongoose;

const inivitationSchema = new Schema({
  fromId:
    {
      matchId: { type: Schema.Types.ObjectId, ref: "match" },
    },
  toId:
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  status: {
    type: String,
    default: "pendiente",
  },
}, {timestamps: true});

inivitationSchema.index({createdAt: 1}, {expires: '24h'})

const Invitation = mongoose.model("invitation", inivitationSchema);
module.exports = Invitation;
