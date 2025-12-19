import { api } from "@/lib/axios"
import type { Cart, CartWithRelations } from "@sticker-valley/shared-types"

export const getCart = async (): Promise<CartWithRelations | null> => {
    const res = await api.get("/cart");
    return res.data.success ? res.data.data : null;
}

export const addToCart = async ({ stickerId }: { stickerId: string }): Promise<Cart | null> => {
    const res = await api.post("/cart", { stickerId });
    return res.data.success ? res.data.data : null;
}

export const clearCart = async (): Promise<Cart | null> => {
    const res = await api.delete("/cart/clear");
    return res.data.success ? res.data.data : null;
}

export const updateCartItem = async ({ stickerId, quantity }: { stickerId: string, quantity: number }): Promise<CartWithRelations | null> => {
    const res = await api.patch(`/cart/item/${stickerId}`, { quantity });
    return res.data.success ? res.data.data : null;
}

export const removeCartItem = async ({ stickerId }: { stickerId: string }): Promise<CartWithRelations | null> => {
    const res = await api.delete(`/cart/item/${stickerId}`);
    return res.data.success ? res.data.data : null;
}