const RewardHistory = require('../models/RewardHistory');
const User = require('../models/User');

exports.getUserRewards = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    if (!req.user || req.user.uid !== uid) return res.status(403).json({ message: 'Not allowed' });
    const history = await RewardHistory.find({ userUid: uid }).sort({ createdAt: -1 }).limit(100);
    const user = await User.findOne({ uid });
    res.json({ totalPoints: user ? user.rewardPoints : 0, history });
  } catch (err) { next(err); }
};