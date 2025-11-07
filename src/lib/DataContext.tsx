import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Review, Reservation, Restaurant, Offer, Event, MenuItem, mockReviews, mockReservations, mockRestaurants } from './mockData';

interface DataContextType {
  reviews: Review[];
  reservations: Reservation[];
  restaurants: Restaurant[];
  addReview: (review: Review) => void;
  updateReview: (reviewId: string, review: Review) => void;
  deleteReview: (reviewId: string) => void;
  addReservation: (reservation: Reservation) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurantStatus: (restaurantId: string, status: 'approved' | 'pending' | 'rejected') => void;
  updateReservationStatus: (reservationId: string, status: 'confirmed' | 'rejected', tableNumber?: string) => void;
  addOfferToRestaurant: (restaurantId: string, offer: Offer) => void;
  addEventToRestaurant: (restaurantId: string, event: Event) => void;
  addMenuItemToRestaurant: (restaurantId: string, menuItem: MenuItem) => void;
  updateMenuItem: (restaurantId: string, menuItemId: string, menuItem: MenuItem) => void;
  deleteMenuItem: (restaurantId: string, menuItemId: string) => void;
  toggleMenuItemLike: (restaurantId: string, menuItemId: string, userId: string) => void;
  toggleReviewLike: (reviewId: string, userId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);

  // Function to calculate sentiment score based on reviews
  const calculateSentimentScore = (restaurantId: string, allReviews: Review[]) => {
    const restaurantReviews = allReviews.filter(r => r.restaurantId === restaurantId);
    const totalReviews = restaurantReviews.length;
    
    if (totalReviews === 0) {
      return { positive: 0, negative: 0, totalReviews: 0 };
    }
    
    // Calculate sentiment based on rating
    // 4-5 stars = positive, 1-2 stars = negative, 3 stars = neutral (doesn't count)
    const positiveReviews = restaurantReviews.filter(r => r.rating >= 4).length;
    const negativeReviews = restaurantReviews.filter(r => r.rating <= 2).length;
    
    const positivePercentage = Math.round((positiveReviews / totalReviews) * 100);
    const negativePercentage = Math.round((negativeReviews / totalReviews) * 100);
    
    return {
      positive: positivePercentage,
      negative: negativePercentage,
      totalReviews
    };
  };

  // Function to update restaurant sentiment and rating
  const updateRestaurantStats = (restaurantId: string, allReviews: Review[]) => {
    setRestaurants(prev => prev.map(restaurant => {
      if (restaurant.id === restaurantId) {
        const restaurantReviews = allReviews.filter(r => r.restaurantId === restaurantId);
        const sentimentScore = calculateSentimentScore(restaurantId, allReviews);
        
        // Calculate average rating
        const avgRating = restaurantReviews.length > 0
          ? restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length
          : 0;
        
        return {
          ...restaurant,
          sentimentScore,
          rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
          reviewCount: restaurantReviews.length
        };
      }
      return restaurant;
    }));
  };

  const addReview = (review: Review) => {
    setReviews(prev => {
      const newReviews = [review, ...prev];
      // Update restaurant stats after adding review
      updateRestaurantStats(review.restaurantId, newReviews);
      return newReviews;
    });
  };

  const updateReview = (reviewId: string, review: Review) => {
    setReviews(prev => {
      const newReviews = prev.map(r => r.id === reviewId ? review : r);
      // Update restaurant stats after updating review
      updateRestaurantStats(review.restaurantId, newReviews);
      return newReviews;
    });
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => {
      const reviewToDelete = prev.find(r => r.id === reviewId);
      const newReviews = prev.filter(r => r.id !== reviewId);
      
      // Update restaurant stats after deleting review
      if (reviewToDelete) {
        updateRestaurantStats(reviewToDelete.restaurantId, newReviews);
      }
      
      return newReviews;
    });
  };

  const addReservation = (reservation: Reservation) => {
    setReservations(prev => [reservation, ...prev]);
  };

  const addRestaurant = (restaurant: Restaurant) => {
    setRestaurants(prev => [restaurant, ...prev]);
  };

  const updateRestaurantStatus = (restaurantId: string, status: 'approved' | 'pending' | 'rejected') => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === restaurantId) {
        // Set approval date when approving a restaurant
        if (status === 'approved' && !r.approvalDate) {
          return { ...r, status, approvalDate: new Date().toISOString().split('T')[0] };
        }
        return { ...r, status };
      }
      return r;
    }));
  };

  const updateReservationStatus = (reservationId: string, status: 'confirmed' | 'rejected', tableNumber?: string) => {
    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status, tableNumber } : r));
  };

  const addOfferToRestaurant = (restaurantId: string, offer: Offer) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, offers: [...r.offers, offer] } : r));
  };

  const addEventToRestaurant = (restaurantId: string, event: Event) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, events: [...r.events, event] } : r));
  };

  const addMenuItemToRestaurant = (restaurantId: string, menuItem: MenuItem) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, menu: [...r.menu, menuItem] } : r));
  };

  const updateMenuItem = (restaurantId: string, menuItemId: string, menuItem: MenuItem) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, menu: r.menu.map(m => m.id === menuItemId ? menuItem : m) } : r));
  };

  const deleteMenuItem = (restaurantId: string, menuItemId: string) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, menu: r.menu.filter(m => m.id !== menuItemId) } : r));
  };

  const toggleMenuItemLike = (restaurantId: string, menuItemId: string, userId: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === restaurantId) {
        return {
          ...r,
          menu: r.menu.map(m => {
            if (m.id === menuItemId) {
              const isLiked = m.likedBy.includes(userId);
              return {
                ...m,
                likedBy: isLiked ? m.likedBy.filter(id => id !== userId) : [...m.likedBy, userId],
                likes: isLiked ? m.likes - 1 : m.likes + 1
              };
            }
            return m;
          })
        };
      }
      return r;
    }));
  };

  const toggleReviewLike = (reviewId: string, userId: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const isLiked = r.likedBy.includes(userId);
        return {
          ...r,
          likedBy: isLiked ? r.likedBy.filter(id => id !== userId) : [...r.likedBy, userId],
          likes: isLiked ? r.likes - 1 : r.likes + 1
        };
      }
      return r;
    }));
  };

  return (
    <DataContext.Provider value={{ 
      reviews, 
      reservations, 
      restaurants, 
      addReview, 
      updateReview,
      deleteReview,
      addReservation, 
      addRestaurant,
      updateRestaurantStatus,
      updateReservationStatus,
      addOfferToRestaurant,
      addEventToRestaurant,
      addMenuItemToRestaurant,
      updateMenuItem,
      deleteMenuItem,
      toggleMenuItemLike,
      toggleReviewLike
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};