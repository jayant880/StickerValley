CREATE TYPE "public"."StickerType" AS ENUM('PHYSICAL', 'DIGITAL');--> statement-breakpoint
ALTER TABLE "CartItems" RENAME TO "CartItem";--> statement-breakpoint
ALTER TABLE "Orderitem" RENAME TO "OrderItem";--> statement-breakpoint
ALTER TABLE "User" RENAME COLUMN "avatar" TO "avatarUrl";--> statement-breakpoint
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItems_cartId_Cart_id_fk";
--> statement-breakpoint
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItems_stickerId_Sticker_id_fk";
--> statement-breakpoint
ALTER TABLE "OrderItem" DROP CONSTRAINT "Orderitem_orderId_Order_id_fk";
--> statement-breakpoint
ALTER TABLE "OrderItem" DROP CONSTRAINT "Orderitem_stickerId_Sticker_id_fk";
--> statement-breakpoint
ALTER TABLE "Order" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING'::text;--> statement-breakpoint
DROP TYPE "public"."OrderStatus";--> statement-breakpoint
CREATE TYPE "public"."OrderStatus" AS ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED');--> statement-breakpoint
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"public"."OrderStatus";--> statement-breakpoint
ALTER TABLE "Order" ALTER COLUMN "status" SET DATA TYPE "public"."OrderStatus" USING "status"::"public"."OrderStatus";--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER'::text;--> statement-breakpoint
DROP TYPE "public"."Role";--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('CUSTOMER', 'VENDOR', 'ADMIN');--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER'::"public"."Role";--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "role" SET DATA TYPE "public"."Role" USING "role"::"public"."Role";--> statement-breakpoint
ALTER TABLE "Sticker" ADD COLUMN "type" "StickerType" NOT NULL;--> statement-breakpoint
ALTER TABLE "Sticker" ADD COLUMN "stock" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_Cart_id_fk" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_stickerId_Sticker_id_fk" FOREIGN KEY ("stickerId") REFERENCES "public"."Sticker"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_Order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_stickerId_Sticker_id_fk" FOREIGN KEY ("stickerId") REFERENCES "public"."Sticker"("id") ON DELETE no action ON UPDATE no action;