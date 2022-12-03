const mongoose = require('mongoose');

const cacheRecordSchema = new mongoose.Schema({
  key: String,
  data: mongoose.Schema.Types.Mixed,
  expirationTime: Number
}, {timestamps: true})

/**
 * @typedef CacheRecord
 */
const CacheRecord = mongoose.models.CacheRecord || mongoose.model('CacheRecord', cacheRecordSchema);

module.exports = CacheRecord;


