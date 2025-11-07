import { useState } from 'react';
import { Restaurant, analyzeSentiment } from '../lib/mockData';
import { useAuth } from '../lib/AuthContext';
import { useData } from '../lib/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ReviewFormProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewForm({ restaurant, isOpen, onClose }: ReviewFormProps) {
  const { user } = useAuth();
  const { addReview } = useData();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const sentiment = analyzeSentiment(comment, rating);
    
    const newReview = {
      id: `rev_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      sentiment,
      likes: 0,
      likedBy: [],
    };
    
    addReview(newReview);
    
    toast.success('Review submitted successfully!', {
      description: `Sentiment: ${sentiment}`,
    });
    
    setComment('');
    setRating(5);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Write a Review for {restaurant.name}</DialogTitle>
          <DialogDescription>
            Share your experience and help others discover great food.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Your rating and review will update the restaurant's sentiment score (4-5 stars = positive, 1-2 stars = negative)
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}