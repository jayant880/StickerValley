import type { Cart, CartItem, Sticker } from "@sticker-valley/shared-types";

export interface CartItemWithStickers extends CartItem {
    sticker: Sticker;
}

export interface CartWithCartItems extends Cart {
    items: CartItemWithStickers[];
    totalItems: number;
    totalAmount: number;
}
