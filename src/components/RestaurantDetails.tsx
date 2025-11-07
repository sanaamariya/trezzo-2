import { useState } from 'react';
import { Restaurant, mockMenuItems } from '../lib/mockData';
import { useData } from '../lib/DataContext';
import { useAuth } from '../lib/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Star, MapPin, Heart, ThumbsUp, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { ReviewForm } from './ReviewForm';
import { ReservationForm } from './ReservationForm';

interface RestaurantDetailsProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function RestaurantDetails({
  restaurant,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}: RestaurantDetailsProps) {
  const { reviews, toggleMenuItemLike, toggleReviewLike, restaurants } = useData();
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);

  if (!restaurant) return null;

  // Get the actual restaurant from context to have updated menu items
  const currentRestaurant = restaurants.find(r => r.id === restaurant.id) || restaurant;
  
  // Use restaurant's own menu items
  const menuItems = currentRestaurant.menu.length > 0 ? currentRestaurant.menu : mockMenuItems.slice(0, 4);
  
  // Reviews for this restaurant
  const restaurantReviews = reviews.filter((r) => r.restaurantId === restaurant.id);

  const handleMenuItemLike = (menuItemId: string) => {
    if (!user) return;
    toggleMenuItemLike(restaurant.id, menuItemId, user.id);
  };

  const handleReviewLike = (reviewId: string) => {
    if (!user) return;
    toggleReviewLike(reviewId, user.id);
  };

  const positiveReviews = restaurantReviews.filter((r) => r.sentiment === 'positive').length;
  const negativeReviews = restaurantReviews.filter((r) => r.sentiment === 'negative').length;
  const totalReviews = restaurantReviews.length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Restaurant Details</DialogTitle>
            <DialogDescription>
              View menu, reviews, offers, and make reservations.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header Image */}
            <div className="relative h-64 -mx-6 -mt-6">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              {restaurant.verified && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                  ✓ Verified
                </div>
              )}
            </div>

            {/* Restaurant Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">{restaurant.name}</h2>
                  <p className="text-muted-foreground">{restaurant.cuisine.join(', ')}</p>
                </div>
                <Button
                  variant={isFavorite ? 'default' : 'outline'}
                  size="icon"
                  onClick={onToggleFavorite}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="text-sm text-muted-foreground">({restaurant.reviewCount})</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{restaurant.distance} km away</span>
                </div>
                <span className="text-sm">{restaurant.priceRange}</span>
              </div>

              {/* Badges & Awards */}
              {restaurant.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {restaurant.badges.map((badge) => (
                    <Badge key={badge.id} variant="secondary" className="text-sm">
                      {badge.icon} {badge.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Sentiment Analysis */}
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Review Sentiment Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span>Positive Reviews</span>
                      </div>
                      <span className="font-semibold text-green-600">
                        {restaurant.sentimentScore.positive}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${restaurant.sentimentScore.positive}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                        <span>Negative Reviews</span>
                      </div>
                      <span className="font-semibold text-red-600">
                        {restaurant.sentimentScore.negative}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${restaurant.sentimentScore.negative}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Based on {restaurant.sentimentScore.totalReviews} reviews. 
                    4-5 stars = positive, 1-2 stars = negative.
                  </p>
                </CardContent>
              </Card>

              <p className="text-muted-foreground">{restaurant.description}</p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={() => setShowReviewForm(true)} className="flex-1">
                  Write Review
                </Button>
                <Button onClick={() => setShowReservationForm(true)} variant="outline" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reserve Table
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="menu" className="flex-1">Menu</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
                <TabsTrigger value="offers" className="flex-1">Offers</TabsTrigger>
              </TabsList>

              <TabsContent value="menu" className="space-y-4">
                <h3 className="font-semibold">Famous Dishes</h3>
                {menuItems.length > 0 ? menuItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              {item.isFamous && (
                                <Badge variant="secondary" className="text-xs">
                                  ⭐ Famous
                                </Badge>
                              )}
                            </div>
                            <span className="font-semibold">₹{item.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <button 
                              onClick={() => handleMenuItemLike(item.id)}
                              className={`flex items-center gap-1 hover:text-primary transition-colors ${
                                user && item.likedBy?.includes(user.id) ? 'text-primary' : ''
                              }`}
                            >
                              <ThumbsUp className={`w-4 h-4 ${user && item.likedBy?.includes(user.id) ? 'fill-current' : ''}`} />
                              <span>{item.likes}</span>
                            </button>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{item.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="text-center text-muted-foreground py-8">No menu items available</p>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {restaurantReviews.length > 0 ? restaurantReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{review.userName}</h4>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm mb-2">{review.comment}</p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={review.sentiment === 'positive' ? 'default' : review.sentiment === 'negative' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {review.sentiment === 'positive' ? '😊 Positive' : review.sentiment === 'negative' ? '😞 Negative' : '😐 Neutral'}
                            </Badge>
                            <button 
                              onClick={() => handleReviewLike(review.id)}
                              className={`text-xs flex items-center gap-1 hover:text-primary transition-colors ${
                                user && review.likedBy?.includes(user.id) ? 'text-primary' : 'text-muted-foreground'
                              }`}
                            >
                              <ThumbsUp className={`w-3 h-3 ${user && review.likedBy?.includes(user.id) ? 'fill-current' : ''}`} />
                              {review.likes}
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="text-center text-muted-foreground py-8">No reviews yet</p>
                )}
              </TabsContent>

              <TabsContent value="offers" className="space-y-4">
                {restaurant.offers.length > 0 ? (
                  restaurant.offers.map((offer) => (
                    <Card key={offer.id} className="bg-orange-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{offer.title}</h4>
                            <p className="text-sm text-muted-foreground">{offer.description}</p>
                          </div>
                          <Badge variant="secondary" className="text-lg">
                            {offer.discount}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Valid until: {offer.validUntil}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No active offers</p>
                )}

                {restaurant.events.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Upcoming Events</h3>
                    {restaurant.events.map((event) => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          <p className="text-sm">
                            📅 {event.date} at {event.time}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <ReviewForm
        isOpen={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        restaurant={restaurant}
      />

      <ReservationForm
        isOpen={showReservationForm}
        onClose={() => setShowReservationForm(false)}
        restaurant={restaurant}
      />
    </>
  );
}