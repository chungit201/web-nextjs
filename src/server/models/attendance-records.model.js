const mongoose = require("mongoose");
const {toJSON, paginate} = require("./plugins");

const atdRecordSchema = new mongoose.Schema({
    cardId: {
      type: String,
      trim: true,
      required: true,
    },
    time: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    collection: 'attendancerecords',
    timestamps: true
  }
);

atdRecordSchema.plugin(toJSON);
atdRecordSchema.plugin(paginate);

// will call before save method => check if password is modified, then hash it
atdRecordSchema.pre("save", async function (next) {
  const user = this;
  user.time = new Date(this.createdAt).getTime();
  next();
});

/**
 * @typedef AttendanceRecord
 */
const AttendanceRecord =mongoose.models.AttendanceRecord || mongoose.model("AttendanceRecord", atdRecordSchema);

module.exports = AttendanceRecord;
