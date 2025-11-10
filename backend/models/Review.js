const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  userUid: { type: String, required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  sentiment: { type: String, enum: ['positive','negative','neutral'], default: 'neutral' },
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);