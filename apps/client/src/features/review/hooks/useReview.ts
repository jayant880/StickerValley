import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    addReview,
    deleteReview,
    getReviewsByStickerId,
    getReviewsByUserId,
} from '../api/review.api';

export const useGetReviewsByStickerIdQuery = (stickerId: string) => {
    return useQuery({
        queryKey: ['reviews', stickerId],
        queryFn: () => getReviewsByStickerId(stickerId),
        retry: 2,
        retryDelay: 2000,
    });
};

export const useGetReviewByUserIdQuery = (userId: string) => {
    return useQuery({
        queryKey: ['reviews', userId],
        queryFn: () => getReviewsByUserId(userId),
        enabled: !!userId,
        retry: 2,
        retryDelay: 2000,
    });
};

export const useReviewMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            stickerId,
            rating,
            comment,
        }: {
            stickerId: string;
            rating: number;
            comment: string;
        }) => addReview(stickerId, rating, comment),
        onSuccess: (data) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ['reviews', data.stickerId] });
            }
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

export const useReviewDeleteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: string) => deleteReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

const useReview = () => {
    const reviewMutation = useReviewMutation();
    const reviewDeleteMutation = useReviewDeleteMutation();

    return {
        useGetReviewByUserIdQuery,
        useGetReviewsByStickerIdQuery,
        reviewMutation,
        reviewDeleteMutation,
    };
};

export default useReview;
