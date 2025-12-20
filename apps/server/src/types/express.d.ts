import { CartWithItems, OrderWithItems, WishlistWithItems, User } from "../db/schema";

declare global {
    namespace Express {
        interface Request {
            user: User;
            cart: CartWithItems;
            order: OrderWithItems;
            wishlist: WishlistWithItems;
        }
    }
}