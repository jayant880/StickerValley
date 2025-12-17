import { api } from "@/lib/axios"
import type { OrderWithItems } from "../types/order.type";
import type { Order } from "@sticker-valley/shared-types";

export const createOrder = async ({ cartId }: { cartId: string }): Promise<OrderWithItems | null> => {
    const res = await api.post('/orders', { cartId });
    return res.data.success ? res.data.order : null;
}

export const getOrderById = async ({ orderId }: { orderId: string }): Promise<OrderWithItems | null> => {
    const res = await api.get(`/orders/${orderId}`);
    return res.data.success ? res.data.order : null;
}

export const payForOrder = async ({ orderId }: { orderId: string }): Promise<string | null> => {
    const res = await api.put(`/orders/${orderId}/pay`);
    return res.data.success ? res.data.message : null;
}

export const getOrders = async (): Promise<Order[]> => {
    const res = await api.get('/orders');
    return res.data.success ? res.data.orders : [];
}