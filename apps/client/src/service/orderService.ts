import { api } from "@/lib/axios"

export const orderService = {
    createOrder: async ({ cartId }: { cartId: string }) => {
        try {
            const res = await api.post("/orders", { cartId });
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    getOrderById: async ({ orderId }: { orderId: string }) => {
        try {
            const res = await api.get(`/orders/${orderId}`);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
}