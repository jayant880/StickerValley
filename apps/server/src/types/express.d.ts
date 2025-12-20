import {
    CartWithItems,
    OrderWithItems,
    WishlistWithItems,
    User,
    ShopWithStickers,
    StickerWithShopAndReviews,
} from "../db/schema";

declare global {
    namespace Express {
        interface Request {
            user: User;
            cart: CartWithItems;
            order: OrderWithItems;
            wishlist: WishlistWithItems;
            shop: ShopWithStickers;
            sticker: StickerWithShopAndReviews;
        }
    }
}
