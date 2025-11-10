const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const { analyze } = require('../utils/sentiment');
const RewardHistory = require('../models/RewardHistory');
const User = require('../models/User');

// post review
exports.create = async (req, res, next) => {
  try {
    const userUid = req.user.uid;
    const { restaurantId, rating, comment } = req.body;
    if (!restaurantId || !rating) return res.status(400).json({ message: 'Missing fields' });
    const sentimentRes = analyze(comment || '');
    const rev = new Review({ userUid, restaurantId, rating, comment, sentiment: sentimentRes.label });
    await rev.save();

    // update restaurant aggregates
    const reviews = await Review.find({ restaurantId });
    const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : rating;
    await Restaurant.findByIdAndUpdate(restaurantId, { avgRating: avg, ratingsCount: reviews.length });

    // reward +10
    const reward = new RewardHistory({ userUid, change: 10, type: 'review', description: `Review for ${restaurantId}` });
    await reward.save();
    await User.findOneAndUpdate({ uid: userUid }, { $inc: { rewardPoints: 10 } });

    res.status(201).json({ review: rev, sentiment: sentimentRes });
  } catch (err) { next(err); }
};

// get sentiment summary for a restaurant
exports.restaurantSentiment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ restaurantId: id });
    const total = reviews.length || 0;
    const pos = reviews.filter(r => r.sentiment === 'positive').length;
    const neg = reviews.filter(r => r.sentiment === 'negative').length;
    res.json({
      totalReviews: total,
      positivePercent: total ? (pos / total) * 100 : 0,
      negativePercent: total ? (neg / total) * 100 : 0,
      avgRating: reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0
    });
  } catch (err) { next(err); }
};