import type { Order, OrderItem, Sticker } from "@sticker-valley/shared-types";

export interface OrderWithItems extends Order {
    items: (OrderItem & {
        sticker: Sticker;
    })[];
}