const Restaurant = require('../models/Restaurant');

// Simple keyword-based recommender. Uses regex matching across cuisine, tags, menu items, name.
// Accepts { craving, lat, lng, radiusKm, limit, cuisine }
async function recommend({ craving, lat, lng, radiusKm = 50, limit = 10, cuisine, minRating = 0 }) {
  const tokens = (craving || '').split(/\s+/).filter(Boolean).map(t => t.trim());
  const or = [];

  if (tokens.length) {
    tokens.forEach(tok => {
      const re = new RegExp(tok, 'i');
      or.push({ cuisine: re });
      or.push({ name: re });
      or.push({ tags: re });
      or.push({ 'menu.items': re });
    });
  } else if (cuisine) {
    or.push({ cuisine: new RegExp(cuisine, 'i') });
  }

  const query = { avgRating: { $gte: minRating } };
  if (or.length) query.$or = or;
  if (cuisine) query.cuisine = new RegExp(cuisine, 'i');

  let docs;
  if (lat !== undefined && lng !== undefined) {
    docs = await Restaurant.find({
      ...query,
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radiusKm * 1000
        }
      }
    }).limit(limit);
  } else {
    docs = await Restaurant.find(query).limit(limit).sort({ avgRating: -1 });
  }
  return docs;
}

module.exports = { recommend };