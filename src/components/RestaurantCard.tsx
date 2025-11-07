import { Restaurant } from '../lib/mockData';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, MapPin, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

// Helper function to check if restaurant is new (less than 2 months old)
const isNewRestaurant = (approvalDate?: string): boolean => {
  if (!approvalDate) return false;
  const approval = new Date(approvalDate);
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  return approval > twoMonthsAgo;
};

export function RestaurantCard({ restaurant, onClick, isFavorite, onToggleFavorite }: RestaurantCardProps) {
  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  const isNew = isNewRestaurant(restaurant.approvalDate);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalFavorite(!localFavorite);
    onToggleFavorite?.();
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-all border bg-white" onClick={onClick}>
      <div className="relative h-40">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 hover:bg-gray-100 transition-colors shadow-sm"
        >
          <Heart
            className={`w-4 h-4 ${localFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {restaurant.verified && (
            <div className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
              ✓ Verified
            </div>
          )}
          {isNew && (
            <div className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              🆕 NEW
            </div>
          )}
        </div>
      </div>
      <CardContent className="p-3">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-sm">{restaurant.name}</h3>
              <p className="text-xs text-muted-foreground">{restaurant.cuisine.join(', ')}</p>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{restaurant.rating}</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground line-clamp-2">{restaurant.description}</p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{restaurant.distance} km</span>
            <span>•</span>
            <span>{restaurant.priceRange}</span>
          </div>

          {/* Sentiment Score */}
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="text-xs">
              {restaurant.sentimentScore.positive}% positive
            </span>
          </div>

          {/* Badges */}
          {restaurant.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {restaurant.badges.slice(0, 2).map((badge) => (
                <Badge key={badge.id} variant="secondary" className="text-xs px-1.5 py-0">
                  {badge.icon}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}