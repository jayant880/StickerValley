import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder, getOrderById, getOrders, payForOrder } from "../api/order.api";
import type { OrderWithItems } from "../types/order.type";

export const useOrderQuery = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: getOrders,
        retry: 2,
        retryDelay: 1000,
    });
}

export const useOrderByIdQuery = (orderId?: string) => {
    return useQuery<OrderWithItems | null>({
        queryKey: ['order', orderId],
        queryFn: () => {
            if (!orderId) throw new Error("Order ID is required");
            return getOrderById({ orderId });
        },
        enabled: !!orderId,
        retry: 2,
        retryDelay: 1000,
    });
}

export const useOrderMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cartId }: { cartId: string }) => createOrder({ cartId }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            if (data?.id) {
                queryClient.setQueryData(['order', data.id], data);
            }
        },
        onError: (error: Error) => {
            console.error("Failed to create order", error);
        }
    })
}

export const usePayForOrderMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId }: { orderId: string }) => payForOrder({ orderId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (error: Error) => {
            console.error("Failed to pay for order", error);
        }
    })
}

const useOrder = () => {
    const orderQuery = useOrderQuery();
    const orderMutation = useOrderMutation();
    const payForOrderMutation = usePayForOrderMutation();

    return {
        orders: orderQuery.data || [],
        isLoading: orderQuery.isLoading,
        isError: orderQuery.isError,
        error: orderQuery.error,

        useOrderQuery,
        useOrderByIdQuery,
        useOrderMutation,
        usePayForOrderMutation,

        createOrder: orderMutation.mutate,
        payForOrder: payForOrderMutation.mutate,

        isCreating: orderMutation.isPending,
        isPaying: payForOrderMutation.isPending,
    };
}

export default useOrder;