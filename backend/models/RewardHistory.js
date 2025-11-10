const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RewardHistorySchema = new Schema({
  userUid: { type: String, required: true },
  change: { type: Number, required: true }, // positive or negative
  type: String, // e.g., 'review','reservation','visit'
  description: String
}, { timestamps: true });

module.exports = mongoose.model('RewardHistory', RewardHistorySchema);