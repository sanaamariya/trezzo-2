import { useState } from 'react';
import { RestaurantCard } from './RestaurantCard';
import { RestaurantMap } from './RestaurantMap';
import { CravingsFilter } from './CravingsFilter';
import { RestaurantDetails } from './RestaurantDetails';
import { AppBackground } from './AppBackground';
import { useAuth } from '../lib/AuthContext';
import { useData } from '../lib/DataContext';
import { Restaurant, Craving, getAIRecommendations } from '../lib/mockData';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Search, LogOut, Star, Calendar, Clock, Award, Trash2, Edit, Heart, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function UserDashboard() {
  const { user, logout } = useAuth();
  const { reviews, reservations, restaurants, deleteReview } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraving, setSelectedCraving] = useState<Craving | undefined>();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>(
    user?.favoriteRestaurants || []
  );
  const [activeTab, setActiveTab] = useState('explore');

  // Filter restaurants to show only approved ones for users
  const approvedRestaurants = restaurants.filter((r) => r.status === 'approved');

  // Filter restaurants based on search and craving
  const filteredRestaurants = approvedRestaurants.filter((restaurant) => {
    const matchesSearch =
      searchQuery === '' ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCraving =
      !selectedCraving || restaurant.cravings.includes(selectedCraving);

    return matchesSearch && matchesCraving;
  });

  // AI Recommendations
  const recommendations = selectedCraving
    ? getAIRecommendations(selectedCraving, favoriteRestaurants, { lat: 37.7749, lng: -122.4194 }).filter((r) => r.status === 'approved')
    : filteredRestaurants.sort((a, b) => a.distance - b.distance);

  // User's reviews
  const userReviews = reviews.filter((r) => r.userId === user?.id);

  // User's reservations
  const userReservations = reservations.filter((r) => r.userId === user?.id);

  const toggleFavorite = (restaurantId: string) => {
    setFavoriteRestaurants((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const favoriteRestaurantList = approvedRestaurants.filter((r) =>
    favoriteRestaurants.includes(r.id)
  );

  // Upcoming offers and events (only from approved restaurants)
  const upcomingOffers = approvedRestaurants.flatMap((r) =>
    r.offers.map((offer) => ({ ...offer, restaurantName: r.name, restaurantId: r.id }))
  );
  const upcomingEvents = approvedRestaurants.flatMap((r) =>
    r.events.map((event) => ({ ...event, restaurantName: r.name, restaurantId: r.id }))
  );

  return (
    <AppBackground>
      {/* Header */}
      <div className="bg-white border-b border-orange-200 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-sm">{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-sm">{user?.name}</h2>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>City Center</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="h-8 text-xs px-3">
              <LogOut className="w-3 h-3 mr-1" />
              Logout
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search restaurants or food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            {/* User Stats & Badges */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="text-2xl font-semibold">{user?.points || 0}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Points</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-2xl font-semibold">{user?.reviewCount || 0}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="text-2xl font-semibold">{favoriteRestaurants.length}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                  </div>
                </div>
                {user?.badges && user.badges.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Your Badges</p>
                    <div className="flex flex-wrap gap-2">
                      {user.badges.map((badge) => (
                        <Badge key={badge.id} variant="secondary">
                          {badge.icon} {badge.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Offers & Events */}
            {(upcomingOffers.length > 0 || upcomingEvents.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>Offers & Events Nearby</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingOffers.slice(0, 2).map((offer) => (
                    <div
                      key={offer.id}
                      className="p-3 bg-orange-50 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{offer.title}</p>
                          <p className="text-sm text-muted-foreground">{offer.restaurantName}</p>
                        </div>
                        <Badge variant="default" className="shadow-md">{offer.discount}</Badge>
                      </div>
                    </div>
                  ))}
                  {upcomingEvents.slice(0, 2).map((event) => (
                    <div key={event.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.restaurantName}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        📅 {event.date} at {event.time}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Map */}
            <RestaurantMap
              restaurants={filteredRestaurants}
              onRestaurantClick={(restaurant) => setSelectedRestaurant(restaurant)}
            />

            {/* Cravings */}
            <CravingsFilter
              onCravingSelect={setSelectedCraving}
              selectedCraving={selectedCraving}
            />

            {/* Recommended Restaurants */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {selectedCraving ? 'AI Recommendations' : 'Recommended for You'}
                </h3>
                {selectedCraving && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCraving(undefined)}>
                    Clear
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onClick={() => setSelectedRestaurant(restaurant)}
                    isFavorite={favoriteRestaurants.includes(restaurant.id)}
                    onToggleFavorite={() => toggleFavorite(restaurant.id)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            {favoriteRestaurantList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteRestaurantList.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onClick={() => setSelectedRestaurant(restaurant)}
                    isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(restaurant.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No favorite restaurants yet</p>
                  <p className="text-sm">Start exploring and save your favorites!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {userReviews.length > 0 ? (
              userReviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{review.restaurantName}</h4>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{review.comment}</p>
                    <Badge
                      variant={review.sentiment === 'positive' ? 'default' : review.sentiment === 'negative' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {review.sentiment === 'positive' ? '😊 Positive' : review.sentiment === 'negative' ? '😞 Negative' : '😐 Neutral'}
                    </Badge>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReview(review.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Add logic to edit the review
                          toast('Edit functionality is not implemented yet.');
                        }}
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No reviews yet</p>
                  <p className="text-sm">Visit restaurants and share your experience!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reservations" className="space-y-4">
            {userReservations.length > 0 ? (
              userReservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{reservation.restaurantName}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {reservation.date} at {reservation.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          👥 {reservation.guests} {reservation.guests === 1 ? 'guest' : 'guests'}
                        </p>
                        {reservation.tableNumber && (
                          <p className="text-sm font-medium mt-1 text-green-600">
                            🪑 Table: {reservation.tableNumber}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          reservation.status === 'confirmed'
                            ? 'default'
                            : reservation.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {reservation.status}
                      </Badge>
                    </div>
                    {reservation.specialRequests && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Note: {reservation.specialRequests}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No reservations yet</p>
                  <p className="text-sm">Book a table at your favorite restaurant!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Restaurant Details Dialog */}
      <RestaurantDetails
        restaurant={selectedRestaurant}
        isOpen={!!selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        isFavorite={selectedRestaurant ? favoriteRestaurants.includes(selectedRestaurant.id) : false}
        onToggleFavorite={() =>
          selectedRestaurant && toggleFavorite(selectedRestaurant.id)
        }
      />
    </AppBackground>
  );
}