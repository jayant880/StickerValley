import type { User, Shop, Sticker, Order, Review, OrderItem, Cart, CartItem } from './database.js';

// --- STICKER ---
export interface StickerWithRelations extends Sticker {
    shop?: Shop | null;
    reviews?: ReviewWithRelations[];
}

// --- SHOP ---
export interface ShopWithRelations extends Shop {
    user?: User | null;
    stickers?: Sticker[];
}

// --- CART ---
export interface CartItemWithSticker extends CartItem {
    sticker?: Sticker | null;
}

export interface CartWithRelations extends Cart {
    user?: User | null;
    items?: CartItemWithSticker[];
    totalItems?: number;
    totalAmount?: number;
}

// --- ORDER ---
export interface OrderItemWithSticker extends OrderItem {
    sticker?: Sticker | null;
}

export interface OrderWithRelations extends Order {
    user?: User | null;
    items?: OrderItemWithSticker[];
}

// --- REVIEW ---
export interface ReviewWithRelations extends Review {
    user?: User | null;
    sticker?: Sticker | null;
}

// --- USER ---
export interface UserReview extends Review {
    sticker?: Sticker | null;
}

export interface UserOrderItem extends OrderItem {
    sticker?: Sticker | null;
}

export interface UserOrder extends Order {
    items?: UserOrderItem[];
}

export interface UserWithRelations extends User {
    shop?: (Shop & { stickers?: Sticker[] }) | null;
    orders?: UserOrder[];
    reviews?: UserReview[];
}
