import { pgTable, text, integer, decimal, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export const roleEnum = pgEnum('Role', ['CUSTOMER', 'VENDOR', 'ADMIN']);
export const orderStatusEnum = pgEnum('OrderStatus', ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']);
export const stickerTypeEnum = pgEnum('StickerType', ['PHYSICAL', 'DIGITAL']);

export const users = pgTable('User', {
    id: text('id').primaryKey(),
    email: text('email').unique().notNull(),
    name: text('name'),
    avatarUrl: text('avatarUrl'),
    role: roleEnum('role').default('CUSTOMER').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const shops = pgTable('Shop', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    name: text('name').notNull(),
    description: text('description'),
    userId: text('userId').unique().notNull().references(() => users.id),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const stickers = pgTable('Sticker', {
    id: text('id').$defaultFn(() => randomUUID()).primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    images: text('images').array(),
    price: decimal('price').notNull(),
    type: stickerTypeEnum('type').notNull(),
    stock: integer('stock').default(0).notNull(),
    shopId: text('shopId').notNull().references(() => shops.id),
    isPublished: boolean('isPublished').default(true).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const carts = pgTable('Cart', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    userId: text('userId').unique().notNull().references(() => users.id),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const cartItems = pgTable('CartItem', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    cartId: text('cartId').notNull().references(() => carts.id),
    stickerId: text('stickerId').notNull().references(() => stickers.id),
    quantity: integer('quantity').notNull(),
});

export const orders = pgTable('Order', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    userId: text('userId').notNull().references(() => users.id),
    totalAmount: decimal('totalAmount').notNull(),
    status: orderStatusEnum('status').default('PENDING').notNull(),
    paymentIntent: text('paymentIntent'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const orderItems = pgTable('OrderItem', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    orderId: text('orderId').notNull().references(() => orders.id),
    stickerId: text('stickerId').notNull().references(() => stickers.id),
    quantity: integer('quantity').notNull(),
    price: decimal('price').notNull(),
});

export const reviews = pgTable('Review', {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    userId: text('userId').notNull().references(() => users.id),
    stickerId: text('stickerId').notNull().references(() => stickers.id),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const wishlists = pgTable("WishList", {
    id: text('id').primaryKey().$defaultFn(() => randomUUID()),
    userId: text('userId').notNull().references(() => users.id),
})

export const wishlistItems = pgTable("WishlistItem", {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    wishlistId: text("wishlistId").notNull().references(() => wishlists.id),
    stickerId: text("stickerId").notNull().references(() => stickers.id),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect;
export type Shop = typeof shops.$inferSelect;
export type Sticker = typeof stickers.$inferSelect;
export type Cart = typeof carts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Wishlist = typeof wishlists.$inferSelect;
export type WishlistItem = typeof wishlistItems.$inferSelect;

export type CartItemWithSticker = CartItem & { sticker: Sticker };
export type CartWithItems = Cart & { items: CartItemWithSticker[] };

export type OrderItemWithSticker = OrderItem & { sticker: Sticker };
export type OrderWithItems = Order & { items: OrderItemWithSticker[] };

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
    cart: one(carts, {
        fields: [users.id],
        references: [carts.userId],
    }),
    orders: many(orders),
    shop: one(shops, {
        fields: [users.id],
        references: [shops.userId],
    }),
    reviews: many(reviews),
    wishlist: one(wishlists, {
        fields: [users.id],
        references: [wishlists.userId],
    }),
    wishlistItems: many(wishlistItems),
}));

export const shopsRelations = relations(shops, ({ one, many }) => ({
    user: one(users, {
        fields: [shops.userId],
        references: [users.id],
    }),
    stickers: many(stickers),
}));

export const stickersRelations = relations(stickers, ({ one, many }) => ({
    shop: one(shops, {
        fields: [stickers.shopId],
        references: [shops.id],
    }),
    reviews: many(reviews),
    cartItems: many(cartItems),
    orderItems: many(orderItems),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
    user: one(users, {
        fields: [carts.userId],
        references: [users.id],
    }),
    items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
    cart: one(carts, {
        fields: [cartItems.cartId],
        references: [carts.id],
    }),
    sticker: one(stickers, {
        fields: [cartItems.stickerId],
        references: [stickers.id],
    }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    sticker: one(stickers, {
        fields: [orderItems.stickerId],
        references: [stickers.id],
    }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
    user: one(users, {
        fields: [reviews.userId],
        references: [users.id],
    }),
    sticker: one(stickers, {
        fields: [reviews.stickerId],
        references: [stickers.id],
    }),
}));

export const wishlistsRelations = relations(wishlists, ({ one, many }) => ({
    user: one(users, {
        fields: [wishlists.userId],
        references: [users.id],
    }),
    items: many(wishlistItems),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
    wishlist: one(wishlists, {
        fields: [wishlistItems.wishlistId],
        references: [wishlists.id],
    }),
    sticker: one(stickers, {
        fields: [wishlistItems.stickerId],
        references: [stickers.id],
    }),
}));
