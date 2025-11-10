const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  address: String,
  cuisine: String,
  tags: [String],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
  },
  avgRating: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
  menu: [{ name: String, price: Number, description: String }],
  images: [String],
  ownerUid: { type: String, required: true }, // Firebase uid
  activeOffers: [{ type: Schema.Types.ObjectId, ref: 'Offer' }],
  analytics: {
    visits: { type: Number, default: 0 },
    reservations: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 }
  },
  awards: [String],
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);