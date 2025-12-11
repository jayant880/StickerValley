import { api } from "@/lib/axios"

export const CartService = {
    getCart: async () => {
        try {
            const res = await api.get(`/cart`);
            return res.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    addToCart: async ({ stickerId }: { stickerId: string }) => {
        try {
            const res = await api.post(`/cart`, { stickerId });
            return res.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    clearCart: async () => {
        try {
            const res = await api.delete(`/cart/clear`);
            if (res.data.success) {
                return res.data;
            }
            throw new Error("Failed to clear cart");
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateCartItem: async ({ stickerId, quantity }: { stickerId: string, quantity: number }) => {
        try {
            const res = await api.patch(`/cart/item/${stickerId}`, { quantity });
            return res.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    removeCartItem: async ({ stickerId }: { stickerId: string }) => {
        try {
            const res = await api.delete(`/cart/item/${stickerId}`);
            return res.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}