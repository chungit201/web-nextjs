const mongoose = require('mongoose');
const {toJSON} = require('./plugins');
const {tokenTypes} = require("server/config/tokens.config");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL, tokenTypes.GMAIL_ACCESS, tokenTypes.GMAIL_REFRESH],
    required: true
  }
}, {
  collection: 'tokens'
});

tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema)

module.exports = Token;
