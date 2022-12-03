const mongoose = require('mongoose');
const {paginate, toJSON} = require("./plugins");
const dialogSchema = new mongoose.Schema({
  name:{
    type:String,
},
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
},
friend:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
},
avatar:{
    type:String,
},
time:{
    type:String
},
message:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Message'
},

},{timestamps:true});

dialogSchema.plugin(paginate);
dialogSchema.plugin(toJSON);

const Dialog =mongoose.models.Dialog || mongoose.model('Dialog',dialogSchema);
module.exports = Dialog;