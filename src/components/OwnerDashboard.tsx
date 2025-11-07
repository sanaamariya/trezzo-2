import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useData } from '../lib/DataContext';
import { AppBackground } from './AppBackground';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import {
  LogOut,
  Store,
  Calendar,
  Star,
  TrendingUp,
  Users,
  Plus,
  Check,
  X,
  Edit,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { MenuItem } from '../lib/mockData';

export function OwnerDashboard() {
  const { user, logout } = useAuth();
  const { 
    reviews, 
    reservations, 
    restaurants, 
    addRestaurant,
    updateReservationStatus,
    addOfferToRestaurant,
    addEventToRestaurant,
    addMenuItemToRestaurant,
    updateMenuItem,
    deleteMenuItem
  } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRestaurantForMenu, setSelectedRestaurantForMenu] = useState<string>('');
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [showMenuItemDialog, setShowMenuItemDialog] = useState(false);

  const [menuItems, setMenuItems] = useState<Array<{
    name: string;
    description: string;
    price: string;
    category: string;
    image: string;
  }>>([]);

  // Owner's restaurants
  const ownerRestaurants = restaurants.filter((r) => r.ownerId === user?.id);

  // Reservations for owner's restaurants
  const ownerReservations = reservations.filter((res) =>
    ownerRestaurants.some((r) => r.id === res.restaurantId)
  );

  // Reviews for owner's restaurants
  const ownerReviews = reviews.filter((rev) =>
    ownerRestaurants.some((r) => r.id === rev.restaurantId)
  );

  const [tableNumber, setTableNumber] = useState<{ [key: string]: string }>({});

  const handleAcceptReservation = (id: string) => {
    const table = tableNumber[id];
    if (!table) {
      toast.error('Please enter a table number');
      return;
    }
    updateReservationStatus(id, 'confirmed', table);
    toast.success('Reservation confirmed!', {
      description: `Table ${table} assigned`,
    });
    setTableNumber(prev => ({ ...prev, [id]: '' }));
  };

  const handleRejectReservation = (id: string) => {
    updateReservationStatus(id, 'rejected');
    toast.error('Reservation rejected');
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const restaurantId = formData.get('restaurantId') as string;
    
    if (!restaurantId) {
      toast.error('Please select a restaurant');
      return;
    }

    const newOffer = {
      id: `offer_${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      discount: formData.get('discount') as string,
      validUntil: formData.get('validUntil') as string,
      restaurantId,
    };

    addOfferToRestaurant(restaurantId, newOffer);
    toast.success('Offer added successfully!', {
      description: 'This offer will now appear to users in the Explore section.',
    });
    (e.target as HTMLFormElement).reset();
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const restaurantId = formData.get('restaurantId') as string;
    
    if (!restaurantId) {
      toast.error('Please select a restaurant');
      return;
    }

    const newEvent = {
      id: `event_${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      restaurantId,
    };

    addEventToRestaurant(restaurantId, newEvent);
    toast.success('Event added successfully!', {
      description: 'This event will now appear to users in the Explore section.',
    });
    (e.target as HTMLFormElement).reset();
  };

  const handleAddMenuItem = () => {
    setEditingMenuItem(null);
    setShowMenuItemDialog(true);
  };

  const handleEditMenuItem = (restaurantId: string, menuItem: MenuItem) => {
    setSelectedRestaurantForMenu(restaurantId);
    setEditingMenuItem(menuItem);
    setShowMenuItemDialog(true);
  };

  const handleDeleteMenuItem = (restaurantId: string, menuItemId: string) => {
    deleteMenuItem(restaurantId, menuItemId);
    toast.success('Menu item deleted');
  };

  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const restaurantId = selectedRestaurantForMenu || (formData.get('restaurantId') as string);
    
    if (!restaurantId) {
      toast.error('Please select a restaurant');
      return;
    }

    const menuItem: MenuItem = {
      id: editingMenuItem?.id || `menu_${Date.now()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      image: formData.get('image') as string || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      likes: editingMenuItem?.likes || 0,
      likedBy: editingMenuItem?.likedBy || [],
      rating: editingMenuItem?.rating || 0,
      isFamous: false,
      cravings: [],
    };

    if (editingMenuItem) {
      updateMenuItem(restaurantId, menuItem.id, menuItem);
      toast.success('Menu item updated!');
    } else {
      addMenuItemToRestaurant(restaurantId, menuItem);
      toast.success('Menu item added!');
    }

    setShowMenuItemDialog(false);
    setEditingMenuItem(null);
    setSelectedRestaurantForMenu('');
  };

  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newRestaurant = {
      id: `r_${Date.now()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      image: formData.get('image') as string || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      cuisine: (formData.get('cuisine') as string).split(',').map(c => c.trim()),
      address: formData.get('address') as string,
      lat: 37.7749,
      lng: -122.4194,
      rating: 0,
      reviewCount: 0,
      priceRange: formData.get('priceRange') as string,
      distance: 0,
      cravings: [],
      menu: menuItems.map((item, index) => ({
        id: `menu_${Date.now()}_${index}`,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price),
        category: item.category,
        image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        likes: 0,
        likedBy: [],
        rating: 0,
        isFamous: false,
        cravings: [],
      })),
      offers: [],
      events: [],
      badges: [],
      sentimentScore: { positive: 0, negative: 0, totalReviews: 0 },
      ownerId: user.id,
      status: 'pending' as const,
      verified: false,
    };
    
    addRestaurant(newRestaurant);
    
    toast.success('Restaurant submitted for approval!', {
      description: 'Your restaurant will be reviewed by admin.',
    });
    
    setMenuItems([]);
    (e.target as HTMLFormElement).reset();
  };

  const handleAddMenuItemToForm = () => {
    setMenuItems([...menuItems, { name: '', description: '', price: '', category: '', image: '' }]);
  };

  const handleRemoveMenuItemFromForm = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const handleMenuItemChange = (index: number, field: string, value: string) => {
    const updated = [...menuItems];
    updated[index] = { ...updated[index], [field]: value };
    setMenuItems(updated);
  };

  // Analytics
  const totalReservations = ownerReservations.length;
  const confirmedReservations = ownerReservations.filter((r) => r.status === 'confirmed').length;
  const totalReviews = ownerReviews.length;
  const avgRating =
    totalReviews > 0
      ? (ownerReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '0';

  return (
    <AppBackground>
      {/* Header */}
      <div className="bg-white border-b border-orange-200 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">Restaurant Owner</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="offers">Offers & Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Store className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-semibold">{ownerRestaurants.length}</div>
                  <p className="text-sm text-muted-foreground">Restaurants</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-semibold">{totalReservations}</div>
                  <p className="text-sm text-muted-foreground">Reservations</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-semibold">{avgRating}</div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-semibold">{totalReviews}</div>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reservations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reservations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ownerReservations.slice(0, 5).map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{reservation.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {reservation.restaurantName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {reservation.date} at {reservation.time} • {reservation.guests} guests
                        {reservation.tableNumber && ` • Table ${reservation.tableNumber}`}
                      </p>
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
                ))}
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ownerReviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-sm">{review.userName}</p>
                          <p className="text-xs text-muted-foreground">{review.restaurantName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-4">
            {/* Add Restaurant Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Restaurant</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddRestaurant} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Restaurant Name</Label>
                      <Input name="name" placeholder="e.g., The Grill House" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Price Range</Label>
                      <select name="priceRange" className="w-full px-3 py-2 border rounded-lg bg-input-background" required>
                        <option value="₹">₹ - Budget</option>
                        <option value="₹₹">₹₹ - Moderate</option>
                        <option value="₹₹₹">₹₹₹ - Premium</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea name="description" placeholder="Describe your restaurant..." required />
                  </div>
                  <div className="space-y-2">
                    <Label>Cuisine Types (comma separated)</Label>
                    <Input name="cuisine" placeholder="e.g., Italian, Pizza, Pasta" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input name="address" placeholder="123 Main St, City" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL (optional)</Label>
                    <Input name="image" type="url" placeholder="https://..." />
                  </div>
                  
                  {/* Menu Items Section */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <Label>Menu Items (optional)</Label>
                      <Button type="button" size="sm" variant="outline" onClick={handleAddMenuItemToForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Menu Item
                      </Button>
                    </div>
                    {menuItems.map((item, index) => (
                      <Card key={index}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Menu Item {index + 1}</h4>
                            <Button 
                              type="button" 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleRemoveMenuItemFromForm(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Item name"
                              value={item.name}
                              onChange={(e) => handleMenuItemChange(index, 'name', e.target.value)}
                              required
                            />
                            <Input
                              placeholder="Price (₹)"
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => handleMenuItemChange(index, 'price', e.target.value)}
                              required
                            />
                          </div>
                          <Input
                            placeholder="Category (e.g., Main Course, Dessert)"
                            value={item.category}
                            onChange={(e) => handleMenuItemChange(index, 'category', e.target.value)}
                            required
                          />
                          <Textarea
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => handleMenuItemChange(index, 'description', e.target.value)}
                            required
                          />
                          <Input
                            placeholder="Image URL (optional)"
                            type="url"
                            value={item.image}
                            onChange={(e) => handleMenuItemChange(index, 'image', e.target.value)}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Restaurant for Approval
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Restaurants */}
            <div className="space-y-4">
              <h3 className="font-semibold">My Restaurants</h3>
              {ownerRestaurants.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center text-muted-foreground">
                    <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No restaurants yet</p>
                    <p className="text-sm">Add your first restaurant above!</p>
                  </CardContent>
                </Card>
              ) : (
                ownerRestaurants.map((restaurant) => (
                  <Card key={restaurant.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{restaurant.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {restaurant.cuisine.join(', ')}
                              </p>
                            </div>
                            <Badge
                              variant={
                                restaurant.status === 'approved' 
                                  ? 'default' 
                                  : restaurant.status === 'pending'
                                  ? 'secondary'
                                  : 'destructive'
                              }
                            >
                              {restaurant.status}
                            </Badge>
                          </div>
                          {restaurant.status === 'approved' && (
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{restaurant.rating || 'N/A'}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {restaurant.reviewCount} reviews
                              </span>
                              {restaurant.sentimentScore.totalReviews > 0 && (
                                <span className="text-sm">
                                  {restaurant.sentimentScore.positive}% positive
                                </span>
                              )}
                            </div>
                          )}
                          {restaurant.badges.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {restaurant.badges.map((badge) => (
                                <Badge key={badge.id} variant="secondary" className="text-xs">
                                  {badge.icon} {badge.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manage Menu Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ownerRestaurants.filter(r => r.status === 'approved').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No approved restaurants yet. Menu management will be available once your restaurant is approved.
                  </p>
                ) : (
                  <>
                    <Button onClick={handleAddMenuItem}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Menu Item
                    </Button>

                    {ownerRestaurants.filter(r => r.status === 'approved').map((restaurant) => (
                      <div key={restaurant.id} className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <UtensilsCrossed className="w-5 h-5" />
                          {restaurant.name}
                        </h3>
                        {restaurant.menu.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No menu items yet</p>
                        ) : (
                          restaurant.menu.map((item) => (
                            <Card key={item.id}>
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground">{item.category}</p>
                                        <p className="text-sm mt-1">{item.description}</p>
                                        <p className="font-semibold mt-2">₹{item.price}</p>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleEditMenuItem(restaurant.id, item)}
                                        >
                                          <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleDeleteMenuItem(restaurant.id, item.id)}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manage Reservations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ownerReservations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No reservations yet</p>
                ) : (
                  ownerReservations.map((reservation) => (
                    <div key={reservation.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{reservation.userName}</p>
                          <p className="text-sm text-muted-foreground">
                            {reservation.restaurantName}
                          </p>
                          <p className="text-sm mt-1">
                            📅 {reservation.date} at {reservation.time}
                          </p>
                          <p className="text-sm">👥 {reservation.guests} guests</p>
                          {reservation.specialRequests && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Note: {reservation.specialRequests}
                            </p>
                          )}
                          {reservation.tableNumber && (
                            <p className="text-sm font-medium mt-1 text-green-600">
                              Table: {reservation.tableNumber}
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
                      {reservation.status === 'pending' && (
                        <div className="space-y-2">
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <Label htmlFor={`table-${reservation.id}`} className="text-sm">Table Number</Label>
                              <Input
                                id={`table-${reservation.id}`}
                                placeholder="e.g., A1, B5"
                                value={tableNumber[reservation.id] || ''}
                                onChange={(e) => setTableNumber({ ...tableNumber, [reservation.id]: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleAcceptReservation(reservation.id)}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleRejectReservation(reservation.id)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            {/* Add Offer Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddOffer} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Restaurant</Label>
                    <select name="restaurantId" className="w-full px-3 py-2 border rounded-lg bg-input-background" required>
                      <option value="">Select a restaurant</option>
                      {ownerRestaurants.filter(r => r.status === 'approved').map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input name="title" placeholder="e.g., 20% Off" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Discount</Label>
                      <Input name="discount" placeholder="e.g., 20%" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea name="description" placeholder="Offer details..." required />
                  </div>
                  <div className="space-y-2">
                    <Label>Valid Until</Label>
                    <Input name="validUntil" type="date" required />
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Offer
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Add Event Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Event</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Restaurant</Label>
                    <select name="restaurantId" className="w-full px-3 py-2 border rounded-lg bg-input-background" required>
                      <option value="">Select a restaurant</option>
                      {ownerRestaurants.filter(r => r.status === 'approved').map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Event Title</Label>
                    <Input name="title" placeholder="e.g., Live Music Night" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea name="description" placeholder="Event details..." required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input name="date" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input name="time" type="time" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Active Offers and Events */}
            <Card>
              <CardHeader>
                <CardTitle>Active Offers & Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ownerRestaurants.map((restaurant) => (
                  <div key={restaurant.id}>
                    {(restaurant.offers.length > 0 || restaurant.events.length > 0) && (
                      <div className="space-y-3">
                        <h4 className="font-medium">{restaurant.name}</h4>
                        {restaurant.offers.map((offer) => (
                          <div key={offer.id} className="p-3 bg-orange-50 rounded-lg border">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{offer.title}</p>
                                <p className="text-sm text-muted-foreground">{offer.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Valid until: {offer.validUntil}
                                </p>
                              </div>
                              <Badge>{offer.discount}</Badge>
                            </div>
                          </div>
                        ))}
                        {restaurant.events.map((event) => (
                          <div key={event.id} className="p-3 bg-blue-50 rounded-lg border">
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <p className="text-sm mt-1">
                              📅 {event.date} at {event.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-semibold">{confirmedReservations}</div>
                  <p className="text-sm text-muted-foreground">Confirmed Reservations</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-semibold">{avgRating}</div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </CardContent>
              </Card>
            </div>

            {ownerRestaurants.map((restaurant) => (
              <Card key={restaurant.id}>
                <CardHeader>
                  <CardTitle>{restaurant.name} Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-semibold">{restaurant.rating}</div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold">{restaurant.reviewCount}</div>
                      <p className="text-sm text-muted-foreground">Reviews</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold">
                        {restaurant.sentimentScore.positive}%
                      </div>
                      <p className="text-sm text-muted-foreground">Positive</p>
                    </div>
                  </div>

                  {/* Sentiment Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Positive Reviews</span>
                      <span className="font-medium text-green-600">
                        {restaurant.sentimentScore.positive}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${restaurant.sentimentScore.positive}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Negative Reviews</span>
                      <span className="font-medium text-red-600">
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
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Menu Item Dialog */}
      <Dialog open={showMenuItemDialog} onOpenChange={setShowMenuItemDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{editingMenuItem ? 'Edit' : 'Add'} Menu Item</DialogTitle>
            <DialogDescription>
              {editingMenuItem ? 'Update the details of your menu item.' : 'Add a new dish to your restaurant menu.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveMenuItem} className="space-y-4">
            {!editingMenuItem && (
              <div className="space-y-2">
                <Label>Restaurant</Label>
                <select name="restaurantId" className="w-full px-3 py-2 border rounded-lg bg-input-background" required>
                  <option value="">Select a restaurant</option>
                  {ownerRestaurants.filter(r => r.status === 'approved').map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Item Name</Label>
              <Input name="name" placeholder="e.g., Butter Chicken" defaultValue={editingMenuItem?.name} required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input name="category" placeholder="e.g., Main Course" defaultValue={editingMenuItem?.category} required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" placeholder="Describe the dish..." defaultValue={editingMenuItem?.description} required />
            </div>
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input name="price" type="number" step="0.01" placeholder="299" defaultValue={editingMenuItem?.price} required />
            </div>
            <div className="space-y-2">
              <Label>Image URL (optional)</Label>
              <Input name="image" type="url" placeholder="https://..." defaultValue={editingMenuItem?.image} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingMenuItem ? 'Update' : 'Add'} Item
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowMenuItemDialog(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppBackground>
  );
}