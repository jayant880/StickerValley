import { createShop, getMyShop, getShopById } from '../api/shop.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useShopStore } from '../store/shopStore';

import { useUser } from '@clerk/clerk-react';
import { getMeKey } from '@/features/auth/api/user.api';

export const useMyShopQuery = () => {
    const { isLoaded, isSignedIn } = useUser();
    return useQuery({
        queryKey: ['myShop'],
        queryFn: getMyShop,
        retry: 2,
        retryDelay: 1000,
        enabled: isLoaded && isSignedIn,
    });
};

export const useShopByIdQuery = (shopId?: string) => {
    return useQuery({
        queryKey: ['shop', shopId],
        queryFn: () => {
            if (!shopId) throw new Error('Shop ID is required');
            return getShopById(shopId);
        },
        enabled: !!shopId,
        retry: 2,
        retryDelay: 1000,
    });
};

export const useCreateShopMutation = () => {
    const queryClient = useQueryClient();
    const { shopForm } = useShopStore();

    return useMutation({
        mutationFn: () => createShop(shopForm),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['shop'] });
            queryClient.invalidateQueries({ queryKey: ['myShop'] });
            queryClient.invalidateQueries({ queryKey: getMeKey() });
            if (data?.id) queryClient.setQueryData(['shop', data.id], data);
        },
        onError: (error) => {
            console.error(`Error while creating shop: ${error}`);
        },
    });
};

const useShop = () => {
    const myShopQuery = useMyShopQuery();
    const createShopMutation = useCreateShopMutation();

    return {
        myShop: myShopQuery.data,
        myShopLoading: myShopQuery.isLoading,
        myShopError: myShopQuery.error,

        useShopByIdQuery,
        useCreateShopMutation,

        createShop: createShopMutation.mutate,

        isCreating: createShopMutation.isPending,
        createShopError: createShopMutation.error,
    };
};

export default useShop;
