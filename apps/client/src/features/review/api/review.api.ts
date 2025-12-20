import { api } from '@/lib/axios';
import type { Review, ReviewWithRelations } from '@sticker-valley/shared-types';

export const addReview = async (
    stickerId: string,
    rating: number,
    comment: string,
): Promise<Review | null> => {
    const res = await api.post('/reviews', { stickerId, rating, comment });
    return res.data.success ? res.data.review : null;
};

export const getReviewsByStickerId = async (stickerId: string): Promise<ReviewWithRelations[]> => {
    const res = await api.get(`/reviews/${stickerId}`);
    return res.data.success ? res.data.reviewsByStickerId : [];
};

export const getReviewsByUserId = async (userId: string): Promise<ReviewWithRelations[]> => {
    const res = await api.get(`/reviews/user/${userId}`);
    return res.data.success ? res.data.reviewsByUser : [];
};

export const deleteReview = async (reviewId: string) => {
    const res = await api.delete(`/reviews/${reviewId}`);
    return res.data.success ? res.data.review : null;
};
