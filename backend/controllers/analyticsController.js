const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

exports.ownerDashboard = async (req, res, next) => {
  try {
    const ownerUid = req.user.uid;
    const restaurants = await Restaurant.find({ ownerUid });
    const restIds = restaurants.map(r => r._id);
    const totalReservations = await Reservation.countDocuments({ restaurantId: { $in: restIds } });
    const totalVisits = restaurants.reduce((s, r) => s + (r.analytics.visits || 0), 0);
    const avgRating = restaurants.length ? (restaurants.reduce((s, r) => s + (r.avgRating || 0), 0) / restaurants.length) : 0;

    // sentiment across restaurants
    const reviews = await Review.find({ restaurantId: { $in: restIds } });
    const pos = reviews.filter(r => r.sentiment === 'positive').length;
    const neg = reviews.filter(r => r.sentiment === 'negative').length;
    const total = reviews.length || 0;
    res.json({
      totalReservations,
      totalVisits,
      avgRating,
      sentiment: {
        positivePercent: total ? (pos/total)*100 : 0,
        negativePercent: total ? (neg/total)*100 : 0
      },
      restaurants
    });
  } catch (err) { next(err); }
};

exports.userDashboard = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const user = await User.findOne({ uid }).populate('favoriteRestaurants savedRestaurants');
    const rewardPoints = user ? user.rewardPoints : 0;
    // favorite cuisines
    const favCuisines = {};
    if (user && user.favoriteRestaurants) {
      user.favoriteRestaurants.forEach(r => { if (r.cuisine) favCuisines[r.cuisine] = (favCuisines[r.cuisine] || 0) + 1; });
    }
    res.json({
      rewardPoints,
      favoriteCuisines: favCuisines,
      savedRestaurants: user ? user.savedRestaurants : []
    });
  } catch (err) { next(err); }
};