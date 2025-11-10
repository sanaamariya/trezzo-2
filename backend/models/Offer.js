const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  title: String,
  description: String,
  discountPercent: Number,
  validUntil: Date,
  eventDate: Date, // optional for events
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  type: { type: String, enum: ['offer','event'], default: 'offer' },
  createdBy: String // ownerUid
}, { timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);