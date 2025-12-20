import { CartWithItems, OrderWithItems, WishlistWithItems } from "../db/schema";

declare global {
    namespace Express {
        interface Request {
            cart: CartWithItems;
            order: OrderWithItems;
            wishlist: WishlistWithItems;
        }
    }
}