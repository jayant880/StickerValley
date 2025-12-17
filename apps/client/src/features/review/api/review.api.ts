import { api } from "@/lib/axios"

export const addReview = async (stickerId: string, rating: number, comment: string) => {
    const res = await api.post("/reviews", { stickerId, rating, comment });
    return res.data.success ? res.data.review : null;
}

export const getReviewsByStickerId = async (stickerId: string) => {
    const res = await api.get(`/reviews/${stickerId}`);
    return res.data.success ? res.data.reviewsByStickerId : [];
}

export const getReviewsByUserId = async (userId: string) => {
    const res = await api.get(`/reviews/user/${userId}`);
    return res.data.success ? res.data.reviewsByUser : [];
}

export const deleteReview = async (reviewId: string) => {
    const res = await api.delete(`/reviews/${reviewId}`);
    return res.data.success ? res.data.review : null;
}