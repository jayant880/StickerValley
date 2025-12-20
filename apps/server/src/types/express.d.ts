import { CartWithItems, OrderWithItems } from "../db/schema";

declare global {
    namespace Express {
        interface Request {
            cart: CartWithItems;
            order: OrderWithItems;
        }
    }
}