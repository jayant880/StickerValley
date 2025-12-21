import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addWishListItem, getWishlist, removeWishListItem } from '../api/wishlist.api';
import type { Sticker } from '@sticker-valley/shared-types';

import { useAuth } from '@clerk/clerk-react';

export const useWishlistQuery = () => {
    const { isSignedIn } = useAuth();
    return useQuery<Sticker[]>({
        queryKey: ['wishlist'],
        queryFn: getWishlist,
        placeholderData: [],
        retry: 2,
        retryDelay: 1000,
        staleTime: 5 * 60 * 1000,
        enabled: !!isSignedIn,
    });
};

export const useWishlistMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (stickerId: string) => addWishListItem(stickerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
        onError: () => {
            console.error('Failed to add sticker to wishlist');
        },
    });
};

export const useRemoveWishlistMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (stickerId: string) => removeWishListItem(stickerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
        onError: () => {
            console.error('Failed to remove sticker from wishlist');
        },
    });
};

const useWishlist = () => {
    const { data, isLoading, error } = useWishlistQuery();
    const addToWishlist = useWishlistMutation();
    const removeFromWishlist = useRemoveWishlistMutation();
    return {
        wishlist: data as Sticker[],
        isLoading,
        error,
        addToWishlist,
        removeFromWishlist,
    };
};

export default useWishlist;
