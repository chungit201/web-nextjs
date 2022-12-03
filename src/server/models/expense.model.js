const mongoose = require("mongoose");
const {paginate, toJSON} = require("./plugins");
const {type} = require("../config/expense.config");

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: type,
    required: true,
  },
  description: {
    type: String,
  },
  note: {
    type: String,
  },
  expectedAmount: {
    type: Number,
  },
  actualAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
  }
}, {
  collection: 'expenses',
  timestamps: true
});

expenseSchema.plugin(paginate);
expenseSchema.plugin(toJSON);

expenseSchema.pre('findOne', async function (next) {
  next();
});

expenseSchema.pre('save', async function (next) {
  next();
});

const Expense =mongoose.models.Expense || mongoose.model(
  "Expense",
  expenseSchema
);

module.exports = Expense;