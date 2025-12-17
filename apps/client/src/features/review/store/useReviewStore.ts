import { create } from "zustand";

interface ReviewStore {
    reviewForm: {
        rating: number;
        comment: string;
    }
    reviewFormActions: {
        setRating: (rating: number) => void;
        setComment: (comment: string) => void;
    }
    clearReviewForm: () => void;
}

const DEFAULT_REVIEW_FORM = {
    rating: 0,
    comment: ""
}

const reviewStore = create<ReviewStore>((set) => ({
    reviewForm: DEFAULT_REVIEW_FORM,
    reviewFormActions: {
        setRating: (rating: number) => set(state => ({ ...state, reviewForm: { ...state.reviewForm, rating } })),
        setComment: (comment: string) => set(state => ({ ...state, reviewForm: { ...state.reviewForm, comment } }))
    },
    clearReviewForm: () => set(state => ({ ...state, reviewForm: DEFAULT_REVIEW_FORM }))
}))

export default reviewStore
