import type { Review, Shop, Sticker } from "@sticker-valley/shared-types";

export interface StickerWithShop extends Sticker {
    shop: Shop;
}

export interface StickerWithShopAndReviews extends StickerWithShop {
    reviews: Review[];
}