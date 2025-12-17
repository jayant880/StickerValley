import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../api/cart.api";

import { useAuth } from "@clerk/clerk-react";

export const useCartQuery = () => {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: ["cart"],
        queryFn: () => getCart(),
        retry: 2,
        retryDelay: 1000,
        enabled: !!isSignedIn,
    })
}

export const useAddToCartMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stickerId }: { stickerId: string }) => addToCart({ stickerId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: Error) => {
            console.error("Failed to add to cart", error);
        }
    })
}

export const useClearCartMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: Error) => {
            console.error("Failed to clear cart", error);
        }
    })
}

export const useUpdateCartItemMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stickerId, quantity }: { stickerId: string, quantity: number }) => updateCartItem({ stickerId, quantity }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: Error) => {
            console.error("Failed to update cart item", error);
        }
    })
}

export const useRemoveCartItemMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stickerId }: { stickerId: string }) => removeCartItem({ stickerId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: Error) => {
            console.error("Failed to remove cart item", error);
        }
    })
}

const useCart = () => {
    const cartQuery = useCartQuery();
    const addToCartMutation = useAddToCartMutation();
    const clearCartMutation = useClearCartMutation();
    const updateCartItemMutation = useUpdateCartItemMutation();
    const removeCartItemMutation = useRemoveCartItemMutation();

    return {
        cart: cartQuery.data,
        isLoading: cartQuery.isLoading,
        isError: cartQuery.isError,
        error: cartQuery.error,

        addToCartMutation,
        clearCartMutation,
        updateCartItemMutation,
        removeCartItemMutation,

        addToCart: addToCartMutation.mutate,
        clearCart: clearCartMutation.mutate,
        updateCartItem: updateCartItemMutation.mutate,
        removeCartItem: removeCartItemMutation.mutate,

        isAdding: addToCartMutation.isPending,
        isClearing: clearCartMutation.isPending,
        isUpdating: updateCartItemMutation.isPending,
        isRemoving: removeCartItemMutation.isPending,
    }
}

export default useCart;