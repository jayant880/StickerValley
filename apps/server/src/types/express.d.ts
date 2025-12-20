import { CartWithItems } from "../db/schema";

declare global {
    namespace Express {
        interface Request {
            cart: CartWithItems;
        }
    }
}