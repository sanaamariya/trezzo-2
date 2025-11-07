// Mock data for the Trezzo app

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'owner' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  favoriteRestaurants: string[];
  badges: Badge[];
  reviewCount: number;
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'user' | 'restaurant';
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  cuisine: string[];
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  priceRange: string;
  distance: number; // in km
  cravings: Craving[];
  menu: MenuItem[];
  offers: Offer[];
  events: Event[];
  badges: Badge[];
  sentimentScore: SentimentScore;
  ownerId: string;
  status: 'approved' | 'pending' | 'rejected';
  verified: boolean;
  approvalDate?: string; // Date when admin approved the restaurant
}

export type Craving = 'spicy' | 'sweet' | 'sour' | 'hot' | 'cold' | 'cheesy' | 'healthy';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  likes: number;
  likedBy: string[]; // Array of user IDs who liked this item
  rating: number;
  isFamous: boolean;
  cravings: Craving[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  image?: string;
  restaurantId: string; // Added to track which restaurant the offer belongs to
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image?: string;
  restaurantId: string; // Added to track which restaurant the event belongs to
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  restaurantId: string;
  restaurantName: string;
  rating: number;
  comment: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  likes: number;
  likedBy: string[]; // Array of user IDs who liked this review
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  specialRequests?: string;
  tableNumber?: string; // Table number assigned by owner
}

export interface SentimentScore {
  positive: number;
  negative: number;
  totalReviews: number;
}

// Mock badges
export const badges: Badge[] = [
  { id: 'b1', name: 'Foodie Explorer', description: 'Reviewed 10+ restaurants', icon: '🌟', type: 'user' },
  { id: 'b2', name: 'Super Reviewer', description: 'Reviewed 50+ restaurants', icon: '👑', type: 'user' },
  { id: 'b3', name: 'Local Guide', description: 'Helped 100+ people', icon: '🗺️', type: 'user' },
  { id: 'b4', name: 'Top Rated', description: '4.5+ average rating', icon: '⭐', type: 'restaurant' },
  { id: 'b5', name: 'Customer Favorite', description: '90%+ positive reviews', icon: '❤️', type: 'restaurant' },
  { id: 'b6', name: 'Verified Excellence', description: 'Verified by Trezzo', icon: '✓', type: 'restaurant' },
];

// Mock restaurants
export const mockRestaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Spice Paradise',
    description: 'Authentic Indian cuisine with a modern twist',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    cuisine: ['Indian', 'Asian'],
    address: '123 Main St, City Center',
    lat: 37.7749,
    lng: -122.4194,
    rating: 4.7,
    reviewCount: 234,
    priceRange: '$$',
    distance: 0.8,
    cravings: ['spicy', 'hot'],
    menu: [],
    offers: [
      { id: 'o1', title: '20% Off', description: 'On orders above ₹500', discount: '20%', validUntil: '2025-10-31', restaurantId: 'r1' },
    ],
    events: [
      { id: 'e1', title: 'Live Music Night', description: 'Enjoy live traditional music', date: '2025-10-15', time: '7:00 PM', restaurantId: 'r1' },
    ],
    badges: [badges[3], badges[4]],
    sentimentScore: { positive: 92, negative: 8, totalReviews: 234 },
    ownerId: 'owner1',
    status: 'approved',
    verified: true,
    approvalDate: '2025-09-15',
  },
  {
    id: 'r2',
    name: 'Sweet Dreams Bakery',
    description: 'Artisanal pastries and desserts',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    cuisine: ['Bakery', 'Desserts'],
    address: '456 Baker Ave, Downtown',
    lat: 37.7849,
    lng: -122.4094,
    rating: 4.9,
    reviewCount: 456,
    priceRange: '$',
    distance: 1.2,
    cravings: ['sweet', 'cold'],
    menu: [],
    offers: [
      { id: 'o2', title: 'Buy 2 Get 1', description: 'On all cupcakes', discount: '33%', validUntil: '2025-10-20', restaurantId: 'r2' },
    ],
    events: [],
    badges: [badges[3], badges[4], badges[5]],
    sentimentScore: { positive: 96, negative: 4, totalReviews: 456 },
    ownerId: 'owner2',
    status: 'approved',
    verified: true,
    approvalDate: '2025-09-16',
  },
  {
    id: 'r3',
    name: 'Green Bowl',
    description: 'Fresh, healthy, and organic meals',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    cuisine: ['Healthy', 'Vegan'],
    address: '789 Wellness Rd, Green District',
    lat: 37.7649,
    lng: -122.4294,
    rating: 4.6,
    reviewCount: 189,
    priceRange: '$$',
    distance: 2.1,
    cravings: ['healthy', 'cold'],
    menu: [],
    offers: [],
    events: [
      { id: 'e2', title: 'Nutrition Workshop', description: 'Learn about healthy eating', date: '2025-10-18', time: '2:00 PM', restaurantId: 'r3' },
    ],
    badges: [badges[3]],
    sentimentScore: { positive: 88, negative: 12, totalReviews: 189 },
    ownerId: 'owner3',
    status: 'approved',
    verified: true,
    approvalDate: '2025-09-17',
  },
  {
    id: 'r4',
    name: 'Cheese Heaven',
    description: 'Ultimate cheese and pizza experience',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    cuisine: ['Italian', 'Pizza'],
    address: '321 Cheese Lane, Little Italy',
    lat: 37.7549,
    lng: -122.4394,
    rating: 4.5,
    reviewCount: 312,
    priceRange: '$$',
    distance: 1.5,
    cravings: ['cheesy', 'hot'],
    menu: [],
    offers: [
      { id: 'o3', title: 'Pizza Tuesday', description: '50% off on all pizzas', discount: '50%', validUntil: '2025-10-31', restaurantId: 'r4' },
    ],
    events: [],
    badges: [badges[3], badges[4]],
    sentimentScore: { positive: 90, negative: 10, totalReviews: 312 },
    ownerId: 'owner1',
    status: 'approved',
    verified: true,
    approvalDate: '2025-09-18',
  },
  {
    id: 'r5',
    name: 'Sour & Sweet',
    description: 'Asian fusion with bold flavors',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    cuisine: ['Asian', 'Fusion'],
    address: '654 Fusion St, Chinatown',
    lat: 37.7949,
    lng: -122.3994,
    rating: 4.4,
    reviewCount: 167,
    priceRange: '$$$',
    distance: 3.2,
    cravings: ['sour', 'sweet', 'spicy'],
    menu: [],
    offers: [],
    events: [],
    badges: [],
    sentimentScore: { positive: 82, negative: 18, totalReviews: 167 },
    ownerId: 'owner2',
    status: 'approved',
    verified: false,
  },
  {
    id: 'r6',
    name: 'The Grill House',
    description: 'Premium steakhouse with fine dining experience',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    cuisine: ['Steakhouse', 'American'],
    address: '789 Premium Ave, Uptown',
    lat: 37.7649,
    lng: -122.4094,
    rating: 0,
    reviewCount: 0,
    priceRange: '$$$',
    distance: 2.5,
    cravings: ['hot'],
    menu: [],
    offers: [],
    events: [],
    badges: [],
    sentimentScore: { positive: 0, negative: 0, totalReviews: 0 },
    ownerId: 'owner4',
    status: 'pending',
    verified: false,
  },
  {
    id: 'r7',
    name: 'Vegan Delight',
    description: 'Plant-based cuisine that tastes amazing',
    image: 'https://images.unsplash.com/photo-1540914124281-342587941389?w=800',
    cuisine: ['Vegan', 'Healthy'],
    address: '456 Green Way, Eco District',
    lat: 37.7849,
    lng: -122.4294,
    rating: 0,
    reviewCount: 0,
    priceRange: '$$',
    distance: 1.8,
    cravings: ['healthy', 'cold'],
    menu: [],
    offers: [],
    events: [],
    badges: [],
    sentimentScore: { positive: 0, negative: 0, totalReviews: 0 },
    ownerId: 'owner5',
    status: 'pending',
    verified: false,
  },
  {
    id: 'r8',
    name: 'Taco Fiesta',
    description: 'Authentic Mexican street food and tacos',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
    cuisine: ['Mexican', 'Street Food'],
    address: '321 Fiesta Blvd, Latino Quarter',
    lat: 37.7549,
    lng: -122.4194,
    rating: 0,
    reviewCount: 0,
    priceRange: '$',
    distance: 1.3,
    cravings: ['spicy', 'hot'],
    menu: [],
    offers: [],
    events: [],
    badges: [],
    sentimentScore: { positive: 0, negative: 0, totalReviews: 0 },
    ownerId: 'owner6',
    status: 'pending',
    verified: false,
  },
];

// Mock menu items
export const mockMenuItems: MenuItem[] = [
  {
    id: 'm1',
    name: 'Butter Chicken',
    description: 'Creamy tomato curry with tender chicken',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    category: 'Main Course',
    likes: 456,
    likedBy: ['user1', 'user2'],
    rating: 4.8,
    isFamous: true,
    cravings: ['spicy', 'hot'],
  },
  {
    id: 'm2',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
    category: 'Dessert',
    likes: 789,
    likedBy: ['user1'],
    rating: 4.9,
    isFamous: true,
    cravings: ['sweet', 'hot'],
  },
  {
    id: 'm3',
    name: 'Quinoa Buddha Bowl',
    description: 'Nutritious bowl with fresh vegetables',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    category: 'Main Course',
    likes: 234,
    likedBy: [],
    rating: 4.6,
    isFamous: false,
    cravings: ['healthy', 'cold'],
  },
  {
    id: 'm4',
    name: 'Margherita Pizza',
    description: 'Classic pizza with mozzarella and basil',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    category: 'Main Course',
    likes: 567,
    likedBy: ['user1'],
    rating: 4.7,
    isFamous: true,
    cravings: ['cheesy', 'hot'],
  },
];

// Populate restaurant menus
mockRestaurants[0].menu = [mockMenuItems[0]];
mockRestaurants[1].menu = [mockMenuItems[1]];
mockRestaurants[2].menu = [mockMenuItems[2]];
mockRestaurants[3].menu = [mockMenuItems[3]];

// Mock reviews
export const mockReviews: Review[] = [
  {
    id: 'rev1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    restaurantId: 'r1',
    restaurantName: 'Spice Paradise',
    rating: 5,
    comment: 'Absolutely amazing food! The butter chicken was incredible and the service was excellent.',
    date: '2025-10-05',
    sentiment: 'positive',
    likes: 12,
    likedBy: ['user2'],
  },
  {
    id: 'rev2',
    userId: 'user1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    restaurantId: 'r2',
    restaurantName: 'Sweet Dreams Bakery',
    rating: 5,
    comment: 'Best pastries in town! Fresh and delicious every time.',
    date: '2025-10-03',
    sentiment: 'positive',
    likes: 8,
    likedBy: [],
  },
  {
    id: 'rev3',
    userId: 'user2',
    userName: 'Mike Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    restaurantId: 'r1',
    restaurantName: 'Spice Paradise',
    rating: 4,
    comment: 'Great food but the wait time was a bit long.',
    date: '2025-10-04',
    sentiment: 'positive',
    likes: 5,
    likedBy: [],
  },
];

// Mock reservations
export const mockReservations: Reservation[] = [
  {
    id: 'res1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    restaurantId: 'r1',
    restaurantName: 'Spice Paradise',
    date: '2025-10-12',
    time: '7:00 PM',
    guests: 4,
    status: 'confirmed',
    specialRequests: 'Window seat preferred',
    tableNumber: 'A1',
  },
  {
    id: 'res2',
    userId: 'user1',
    userName: 'Sarah Johnson',
    restaurantId: 'r2',
    restaurantName: 'Sweet Dreams Bakery',
    date: '2025-10-10',
    time: '3:00 PM',
    guests: 2,
    status: 'pending',
  },
];

// Mock current user
export const mockCurrentUser: User = {
  id: 'user1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  role: 'user',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  phone: '+1 234 567 8900',
  address: '123 Main St, City Center',
  favoriteRestaurants: ['r1', 'r2'],
  badges: [badges[0]],
  reviewCount: 2,
  points: 250,
};

// Sentiment analysis mock function
export const analyzeSentiment = (text: string, rating?: number): 'positive' | 'negative' | 'neutral' => {
  const positiveWords = [
    'amazing', 'excellent', 'great', 'wonderful', 'best', 'delicious', 'fantastic', 'love', 'perfect',
    'awesome', 'outstanding', 'superb', 'brilliant', 'fabulous', 'exceptional', 'incredible', 'marvelous',
    'delightful', 'lovely', 'beautiful', 'good', 'nice', 'enjoyable', 'pleasant', 'tasty', 'yummy',
    'scrumptious', 'divine', 'heavenly', 'exquisite', 'impressive', 'quality', 'fresh', 'recommend',
    'satisfied', 'happy', 'pleased', 'favorite', 'stellar', 'phenomenal', 'top-notch', 'gem'
  ];
  const negativeWords = [
    'bad', 'terrible', 'worst', 'horrible', 'awful', 'disappointing', 'poor', 'disgusting',
    'nasty', 'gross', 'unpleasant', 'bland', 'tasteless', 'stale', 'rotten', 'sour', 'bitter',
    'overpriced', 'expensive', 'cold', 'dry', 'burnt', 'undercooked', 'raw', 'soggy', 'greasy',
    'rude', 'slow', 'dirty', 'unhygienic', 'mediocre', 'subpar', 'inferior', 'lacking', 'flavorless',
    'unsatisfactory', 'regret', 'waste', 'avoid', 'never', 'hate', 'dislike'
  ];
  
  // If rating is provided, use it as the primary indicator
  if (rating !== undefined) {
    if (rating >= 4) return 'positive';
    if (rating <= 2) return 'negative';
    // For 3 stars, fall back to text analysis
  }
  
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

// AI Recommendation engine mock
export const getAIRecommendations = (
  craving: Craving,
  likedRestaurants: string[],
  userLocation: { lat: number; lng: number }
): Restaurant[] => {
  // Filter restaurants by craving
  const filtered = mockRestaurants.filter(r => r.cravings.includes(craving));
  
  // Sort by distance and rating
  return filtered.sort((a, b) => {
    // Boost liked restaurants
    const aLiked = likedRestaurants.includes(a.id) ? -0.5 : 0;
    const bLiked = likedRestaurants.includes(b.id) ? -0.5 : 0;
    
    return (a.distance + aLiked) - (b.distance + bLiked);
  });
};