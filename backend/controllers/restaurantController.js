const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');
const Reservation = require('../models/Reservation');

// Create restaurant (owner)
exports.create = async (req, res, next) => {
  try {
    const ownerUid = req.user.uid;
    const { name, address, cuisine, tags, lat, lng, menu, images } = req.body;
    if (!name || !lat || !lng) return res.status(400).json({ message: 'Missing fields' });
    const rest = new Restaurant({
      name, address, cuisine, tags, menu, images, ownerUid,
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }
    });
    await rest.save();
    res.status(201).json(rest);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rest = await Restaurant.findById(id);
    if (!rest) return res.status(404).json({ message: 'Not found' });
    if (rest.ownerUid !== req.user.uid) return res.status(403).json({ message: 'Not authorized' });
    const body = req.body;
    if (body.lat && body.lng) body.location = { type: 'Point', coordinates: [parseFloat(body.lng), parseFloat(body.lat)] };
    Object.assign(rest, body);
    await rest.save();
    res.json(rest);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rest = await Restaurant.findById(id);
    if (!rest) return res.status(404).json({ message: 'Not found' });
    if (rest.ownerUid !== req.user.uid) return res.status(403).json({ message: 'Not authorized' });
    await rest.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const r = await Restaurant.findById(req.params.id).populate('activeOffers');
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json(r);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const { cuisine, minRating } = req.query;
    const q = {};
    if (cuisine) q.cuisine = new RegExp(cuisine, 'i');
    if (minRating) q.avgRating = { $gte: parseFloat(minRating) };
    const list = await Restaurant.find(q).limit(100).sort({ avgRating: -1 });
    res.json(list);
  } catch (err) { next(err); }
};

// nearby - supports lat,lng,radiusKm,cuisine,minRating
exports.nearby = async (req, res, next) => {
  try {
    const { lat, lng, radiusKm = 10, cuisine, minRating = 0 } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat and lng required' });
    const q = {
      avgRating: { $gte: parseFloat(minRating) }
    };
    if (cuisine) q.cuisine = new RegExp(cuisine, 'i');
    const near = await Restaurant.find({
      ...q,
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radiusKm) * 1000
        }
      }
    }).limit(50);
    res.json(near);
  } catch (err) { next(err); }
};

// compute awards helper endpoint (owner or admin)
exports.computeAwards = async (req, res, next) => {
  try {
    // iterate restaurants and compute awards based on simple rules
    const restaurants = await Restaurant.find();
    for (const r of restaurants) {
      const reviews = await Review.find({ restaurantId: r._id });
      const avg = reviews.length ? (reviews.reduce((s, x) => s + x.rating, 0) / reviews.length) : 0;
      r.avgRating = avg;
      r.ratingsCount = reviews.length;
      r.awards = r.awards || [];
      // Top Rated
      if (avg > 4.5 && reviews.length >= 5) {
        if (!r.awards.includes('Top Rated')) r.awards.push('Top Rated');
      } else {
        r.awards = r.awards.filter(a => a !== 'Top Rated');
      }
      // Customer Favorite (bookmarks)
      if (r.analytics.bookmarks > 50) {
        if (!r.awards.includes('Customer Favorite')) r.awards.push('Customer Favorite');
      } else {
        r.awards = r.awards.filter(a => a !== 'Customer Favorite');
      }
      await r.save();
    }
    res.json({ message: 'Awards recalculated' });
  } catch (err) { next(err); }
};