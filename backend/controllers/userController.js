const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

// Upsert user data synced from Firebase
exports.syncUser = async (req, res, next) => {
  try {
    // req.user from firebaseAuth middleware OR body may contain full info
    const firebaseUser = req.body.firebaseUser || req.user;
    if (!firebaseUser || !firebaseUser.uid) return res.status(400).json({ message: 'User data missing' });
    const data = {
      uid: firebaseUser.uid,
      name: firebaseUser.name || req.body.name,
      email: firebaseUser.email || req.body.email,
      photo: firebaseUser.picture || req.body.photo,
    };
    const user = await User.findOneAndUpdate({ uid: data.uid }, { $set: data }, { upsert: true, new: true });
    res.json(user);
  } catch (err) { next(err); }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    if (req.user && req.user.uid !== uid) return res.status(403).json({ message: 'Not allowed' });
    const updated = await User.findOneAndUpdate({ uid }, { $set: { preferences: req.body.preferences } }, { new: true });
    res.json(updated);
  } catch (err) { next(err); }
};

exports.updateRewards = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    if (req.user && req.user.uid !== uid) return res.status(403).json({ message: 'Not allowed' });
    const { points } = req.body;
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.rewardPoints = (user.rewardPoints || 0) + (points || 0);
    await user.save();
    res.json(user);
  } catch (err) { next(err); }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    if (!req.user || req.user.uid !== uid) return res.status(403).json({ message: 'Not allowed' });
    const user = await User.findOne({ uid }).populate('savedRestaurants favoriteRestaurants');
    const reservations = await Reservation.find({ userUid: uid }).populate('restaurantId').sort({ datetime: -1 }).limit(20);
    res.json({
      user,
      reservations,
      rewardSummary: { points: user ? user.rewardPoints : 0 }
    });
  } catch (err) { next(err); }
};