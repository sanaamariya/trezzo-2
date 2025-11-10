const Offer = require('../models/Offer');
const Restaurant = require('../models/Restaurant');

exports.create = async (req, res, next) => {
  try {
    const ownerUid = req.user.uid;
    const { restaurantId, title, description, discountPercent, validUntil, eventDate, type } = req.body;
    const rest = await Restaurant.findById(restaurantId);
    if (!rest) return res.status(404).json({ message: 'Restaurant not found' });
    if (rest.ownerUid !== ownerUid) return res.status(403).json({ message: 'Not allowed' });
    const offer = new Offer({ restaurantId, title, description, discountPercent, validUntil, eventDate, type, createdBy: ownerUid });
    await offer.save();
    rest.activeOffers.push(offer._id);
    await rest.save();
    res.status(201).json(offer);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const ownerUid = req.user.uid;
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Not found' });
    const rest = await Restaurant.findById(offer.restaurantId);
    if (rest.ownerUid !== ownerUid) return res.status(403).json({ message: 'Not allowed' });
    Object.assign(offer, req.body);
    await offer.save();
    res.json(offer);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const ownerUid = req.user.uid;
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Not found' });
    const rest = await Restaurant.findById(offer.restaurantId);
    if (rest.ownerUid !== ownerUid) return res.status(403).json({ message: 'Not allowed' });
    await offer.deleteOne();
    rest.activeOffers = rest.activeOffers.filter(id => id.toString() !== offer._id.toString());
    await rest.save();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

// fetch active offers/events for user dashboard
exports.active = async (req, res, next) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      validUntil: { $exists: true, $gt: now }
    }).limit(100).populate('restaurantId');
    const events = await Offer.find({
      type: 'event',
      eventDate: { $gte: now }
    }).limit(100).populate('restaurantId');
    res.json({ offers, events });
  } catch (err) { next(err); }
};