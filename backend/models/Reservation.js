const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
  userUid: { type: String, required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  datetime: { type: Date, required: true },
  people: { type: Number, default: 1 },
  status: { type: String, enum: ['booked','cancelled','completed'], default: 'booked' },
}, { timestamps: true });

ReservationSchema.index({ restaurantId: 1, datetime: 1 });

module.exports = mongoose.model('Reservation', ReservationSchema);