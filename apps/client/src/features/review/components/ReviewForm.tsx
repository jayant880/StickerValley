import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useReviewMutation } from '../hooks/useReview';
import useReviewStore from '../store/useReviewStore';

const ReviewForm = ({ stickerId }: { stickerId: string }) => {
    const { reviewForm, reviewFormActions, clearReviewForm } = useReviewStore();
    const { mutate, isPending } = useReviewMutation();
    const [hoverRating, setHoverRating] = useState(0);

    const { rating, comment } = reviewForm;
    const { setRating, setComment } = reviewFormActions;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        mutate(
            { stickerId, rating, comment },
            {
                onSuccess: () => {
                    toast.success('Review added successfully');
                    clearReviewForm();
                    setHoverRating(0);
                },
                onError: (error: Error) => {
                    toast.error('Failed to add review: ' + error.message);
                },
            },
        );
    };

    return (
        <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star
                                    className={`h-8 w-8 ${
                                        star <= (hoverRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Your Review</label>
                    <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this sticker..."
                        className="min-h-[120px] resize-none focus-visible:ring-indigo-500"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            clearReviewForm();
                            setHoverRating(0);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        {isPending ? 'Posting...' : 'Post Review'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
