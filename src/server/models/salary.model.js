const mongoose = require('mongoose');
const {toJSON, paginate} = require('./plugins');

const salarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Department",
  },
  slot:{
    type: Number,
  },
  bonus:{
    type:String,
  },
  fine:{
    type:String
  },
  salary:{
    type:String,
  }
}, {
  collection: 'salary'
});
salarySchema.plugin(paginate);
salarySchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Salary = mongoose.models.Salary || mongoose.model('Salary', salarySchema)

module.exports = Salary;
