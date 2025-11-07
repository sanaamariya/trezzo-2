import { useState } from 'react';
import { Restaurant } from '../lib/mockData';
import { useAuth } from '../lib/AuthContext';
import { useData } from '../lib/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface ReservationFormProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
}

export function ReservationForm({ restaurant, isOpen, onClose }: ReservationFormProps) {
  const { user } = useAuth();
  const { addReservation } = useData();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    const newReservation = {
      id: `res_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      date,
      time,
      guests,
      status: 'pending' as const,
      specialRequests: specialRequests || undefined,
    };
    
    addReservation(newReservation);
    
    toast.success('Reservation request sent!', {
      description: 'The restaurant will confirm your reservation soon.',
    });
    
    setDate('');
    setTime('');
    setGuests(2);
    setSpecialRequests('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Reserve a Table at {restaurant.name}</DialogTitle>
          <DialogDescription>
            Fill in your reservation details and we'll send your request to the restaurant.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg bg-input-background"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requests">Special Requests (Optional)</Label>
            <Textarea
              id="requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g., Window seat, allergies, celebration..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Send Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}