const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  uid: { type: String, required: true, unique: true }, // Firebase uid
  name: String,
  email: String,
  photo: String,
  rewardPoints: { type: Number, default: 0 },
  savedRestaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
  favoriteRestaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
  preferences: { cuisine: [String], dietary: [String] },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);