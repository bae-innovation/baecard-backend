import { Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Review } from '@/features/reviews/schemas/review.schema';

type ReviewDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
};

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
    </div>
  );
}

export function ReviewDetailDialog({
  open,
  onOpenChange,
  review,
}: ReviewDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{review?.title ?? 'Review Details'}</DialogTitle>
        </DialogHeader>
        {review ? (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{review.name}</p>
                <p className="text-muted-foreground">{review.email}</p>
              </div>
              <RatingStars rating={review.rating} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={review.is_visible ? 'default' : 'secondary'}>
                {review.is_visible ? 'Visible' : 'Hidden'}
              </Badge>
              {review.product ? (
                <Badge variant="outline">Product: {review.product.name}</Badge>
              ) : (
                <Badge variant="outline">Standalone review</Badge>
              )}
            </div>
            <div className="rounded-lg border p-4">
              <p className="whitespace-pre-wrap">{review.body}</p>
            </div>
            {review.created_at ? (
              <p className="text-xs text-muted-foreground">
                Submitted {new Date(review.created_at).toLocaleString()}
              </p>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
