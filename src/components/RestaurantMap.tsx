import { useState } from 'react';
import { Restaurant } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Filter, DollarSign, Star } from 'lucide-react';
import { Badge } from './ui/badge';

interface RestaurantMapProps {
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant) => void;
}

export function RestaurantMap({ restaurants, onRestaurantClick }: RestaurantMapProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxDistance: 10,
    priceRange: 'all',
  });

  const filteredRestaurants = restaurants.filter((r) => {
    if (r.rating < filters.minRating) return false;
    if (r.distance > filters.maxDistance) return false;
    if (filters.priceRange !== 'all' && r.priceRange !== filters.priceRange) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Nearby Restaurants</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showFilters && (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <label className="text-sm">Minimum Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value={0}>All ratings</option>
                <option value={3}>3+ stars</option>
                <option value={4}>4+ stars</option>
                <option value={4.5}>4.5+ stars</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Max Distance: {filters.maxDistance} km</label>
              <input
                type="range"
                min={1}
                max={10}
                value={filters.maxDistance}
                onChange={(e) => setFilters({ ...filters, maxDistance: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="all">All prices</option>
                <option value="$">$ Budget</option>
                <option value="$$">$$ Moderate</option>
                <option value="$$$">$$$ Expensive</option>
              </select>
            </div>
          </div>
        )}

        {/* Mock Google Map - Replace with actual Google Maps integration */}
        <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p>Google Maps Integration</p>
              <p className="text-sm">Use Google Maps API to display real map</p>
            </div>
          </div>
          
          {/* Mock map markers */}
          {filteredRestaurants.slice(0, 5).map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="absolute bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              style={{
                top: `${20 + index * 15}%`,
                left: `${30 + index * 10}%`,
              }}
              onClick={() => onRestaurantClick(restaurant)}
            >
              <MapPin className="w-5 h-5" />
            </div>
          ))}
        </div>

        {/* Restaurant list below map */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {filteredRestaurants.length} restaurants found
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                onClick={() => onRestaurantClick(restaurant)}
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{restaurant.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                      {restaurant.rating}
                    </div>
                    <span>•</span>
                    <span>{restaurant.distance} km</span>
                    <span>•</span>
                    <span>{restaurant.priceRange}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
