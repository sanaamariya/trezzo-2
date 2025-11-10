const { recommend } = require('../utils/recommender');

exports.recommend = async (req, res, next) => {
  try {
    const { craving, lat, lng, radiusKm, cuisine, minRating, limit } = req.body;
    const list = await recommend({ craving, lat, lng, radiusKm, cuisine, minRating, limit });
    res.json(list);
  } catch (err) { next(err); }
};