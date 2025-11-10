const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');
const RewardHistory = require('../models/RewardHistory');
const User = require('../models/User');

// create reservation; prevent overlapping exact datetime for same restaurant
exports.create = async (req, res, next) => {
  try {
    const userUid = req.user.uid;
    const { restaurantId, datetime, people } = req.body;
    if (!restaurantId || !datetime) return res.status(400).json({ message: 'Missing fields' });
    const dt = new Date(datetime);
    // Check overlapping - exact same datetime for simplicity
    const conflict = await Reservation.findOne({ restaurantId, datetime: dt, status: 'booked' });
    if (conflict) return res.status(409).json({ message: 'Time slot already booked' });

    const r = new Reservation({ userUid, restaurantId, datetime: dt, people });
    await r.save();

    // increment analytics
    await Restaurant.findByIdAndUpdate(restaurantId, { $inc: { 'analytics.reservations': 1 } });

    // reward user +20
    const reward = new RewardHistory({ userUid, change: 20, type: 'reservation', description: `Reservation at ${restaurantId}` });
    await reward.save();
    await User.findOneAndUpdate({ uid: userUid }, { $inc: { rewardPoints: 20 } });

    res.status(201).json(r);
  } catch (err) { next(err); }
};

exports.userReservations = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const list = await Reservation.find({ userUid: uid }).populate('restaurantId').sort({ datetime: -1 });
    res.json(list);
  } catch (err) { next(err); }
};

exports.cancel = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const r = await Reservation.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    if (r.userUid !== uid) return res.status(403).json({ message: 'Not allowed' });
    r.status = 'cancelled';
    await r.save();
    res.json(r);
  } catch (err) { next(err); }
};

exports.restaurantReservations = async (req, res, next) => {
  try {
    const ownerUid = req.user.uid;
    const { restaurantId } = req.params;
    const rest = await Restaurant.findById(restaurantId);
    if (!rest) return res.status(404).json({ message: 'Restaurant not found' });
    if (rest.ownerUid !== ownerUid) return res.status(403).json({ message: 'Not allowed' });
    const list = await Reservation.find({ restaurantId }).sort({ datetime: -1 });
    res.json(list);
  } catch (err) { next(err); }
};