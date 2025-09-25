import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback?: string) => void;
  isLoading?: boolean;
  pickupDetails?: {
    wasteType: string;
    address: string;
    date: string;
  };
}

export function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  pickupDetails,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, feedback.trim() || undefined);
      // Reset form
      setRating(0);
      setHoverRating(0);
      setFeedback('');
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setFeedback('');
    onClose();
  };

  const displayRating = hoverRating || rating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-brand-primary">
              Rate Your Pickup
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Help us improve our service by rating your pickup experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pickup Details */}
          {pickupDetails && (
            <div className="p-4 bg-brand-light/30 rounded-lg border border-brand-primary/20">
              <h4 className="font-medium text-brand-primary mb-2">
                Pickup Details
              </h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Type:</span>{' '}
                  {pickupDetails.wasteType}
                </p>
                <p>
                  <span className="font-medium">Address:</span>{' '}
                  {pickupDetails.address}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {pickupDetails.date}
                </p>
              </div>
            </div>
          )}

          {/* Star Rating */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              How was your experience?
            </Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-sm"
                  disabled={isLoading}
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      star <= displayRating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    )}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm font-medium text-brand-primary">
                  {rating} star{rating !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-3">
            <Label htmlFor="feedback" className="text-base font-medium">
              Additional Feedback (Optional)
            </Label>
            <Textarea
              id="feedback"
              placeholder="Tell us about your experience, what went well, or how we can improve..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isLoading}
            className="bg-brand-primary hover:bg-brand-secondary text-white"
          >
            {isLoading ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
