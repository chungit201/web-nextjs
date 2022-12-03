const mongoose = require('mongoose');
const {paginate, toJSON} = require("./plugins");
const {Dialog} = require("./index");
const memberSchema = new mongoose.Schema({
  dialog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dialog",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  nickname: {
    type: String,
    maxlength: 200
  },
  role: {
    type: String,
    default: 'member'
  }
}, {timestamps: true});

memberSchema.pre("save", async function (next) {
  const member = this;
  if (member.isModified("dialog")) {
    const dialog = await Dialog.findOne({_id: member.dialog});
    if (await Dialog.countDocuments({user: member.user}) > 0) {
        member.role = 'admin'
    }
  }
  next();
});

memberSchema.plugin(paginate);
memberSchema.plugin(toJSON);

const Member =mongoose.models.Member || mongoose.model('Member', memberSchema);
module.exports = Member;