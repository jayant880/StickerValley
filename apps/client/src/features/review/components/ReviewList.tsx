import type { Review, User } from "@sticker-valley/shared-types";
import { useGetReviewsByStickerIdQuery } from "../hooks/useReview";
import { Spinner } from "@/components/ui/spinner";
import { Star } from "lucide-react";
import ReviewForm from "./ReviewForm";

const ReviewList = ({ stickerId }: { stickerId: string }) => {
    const { data: reviewsData, isLoading, error, isError } = useGetReviewsByStickerIdQuery(stickerId);

    return (
        <div className="mt-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            </div>

            <ReviewForm stickerId={stickerId} />

            <div className="space-y-6">
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <Spinner className="w-8 h-8 text-indigo-600" />
                    </div>
                )}

                {isError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                        Error fetching reviews: {error.message}
                    </div>
                )}

                {!isLoading && !isError && reviewsData?.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">No reviews yet.</p>
                        <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
                    </div>
                )}

                {!isLoading && !isError && reviewsData && reviewsData.length > 0 && (
                    <div className="grid gap-6">
                        {reviewsData.map((review: Review & { user: User }) => (
                            <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 ring-2 ring-white shadow-sm">
                                                {review.user?.avatarUrl ? (
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={review.user.avatarUrl}
                                                        alt={review.user.name || "User"}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-semibold">
                                                        {review.user?.name?.[0]?.toUpperCase() || "U"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{review.user.name || "Anonymous User"}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReviewList