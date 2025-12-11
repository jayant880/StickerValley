import type { CartItem, Sticker } from "@sticker-valley/shared-types";

export interface CartItemWithStickers extends CartItem {
    sticker: Sticker;
}
