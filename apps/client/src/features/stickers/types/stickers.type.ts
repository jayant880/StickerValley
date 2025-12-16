import type { Shop, Sticker } from "@sticker-valley/shared-types";

export interface StickerWithShop extends Sticker {
    shop: Shop;
}