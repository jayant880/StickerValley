import type { ReviewWithRelations } from '@sticker-valley/shared-types';
import { useGetReviewsByStickerIdQuery } from '../hooks/useReview';
import { Spinner } from '@/components/ui/spinner';
import { Star } from 'lucide-react';
import ReviewForm from './ReviewForm';

const ReviewList = ({ stickerId }: { stickerId: string }) => {
    const {
        data: reviewsData,
        isLoading,
        error,
        isError,
    } = useGetReviewsByStickerIdQuery(stickerId);

    return (
        <div className="mx-auto mt-12 max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            </div>

            <ReviewForm stickerId={stickerId} />

            <div className="space-y-6">
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <Spinner className="h-8 w-8 text-indigo-600" />
                    </div>
                )}

                {isError && (
                    <div className="rounded-lg bg-red-50 p-4 text-center text-red-600">
                        Error fetching reviews: {error.message}
                    </div>
                )}

                {!isLoading && !isError && reviewsData?.length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
                        <p className="text-lg text-gray-500">No reviews yet.</p>
                        <p className="mt-1 text-sm text-gray-400">
                            Be the first to share your thoughts!
                        </p>
                    </div>
                )}

                {!isLoading && !isError && reviewsData && reviewsData.length > 0 && (
                    <div className="grid gap-6">
                        {reviewsData.map((review: ReviewWithRelations) => (
                            <div
                                key={review.id}
                                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300 shadow-sm ring-2 ring-white">
                                                {review.user?.avatarUrl ? (
                                                    <img
                                                        className="h-full w-full object-cover"
                                                        src={review.user.avatarUrl}
                                                        alt={review.user.name || 'User'}
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-indigo-100 font-semibold text-indigo-600">
                                                        {review.user?.name?.[0]?.toUpperCase() ||
                                                            'U'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {review.user?.name || 'Anonymous User'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-600">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewList;
