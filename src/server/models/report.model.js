const mongoose = require("mongoose");
const {paginate, toJSON} = require("./plugins");

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true
  },
  isSample: {
    type: Boolean,
    default: false
  },
  sample: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  },
  isDelete: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  searchDate: {
    type: Number
  }
}, {
  timestamps: true
});

reportSchema.plugin(paginate);
reportSchema.plugin(toJSON);

const  Report =mongoose.models.Report ||  mongoose.model(
  "Report",
  reportSchema
);

module.exports = Report;