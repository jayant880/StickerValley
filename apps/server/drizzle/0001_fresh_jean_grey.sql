ALTER TABLE "CartItems" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "CartItems" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "CartItems" ALTER COLUMN "cartId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "CartItems" ALTER COLUMN "stickerId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Cart" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Cart" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Cart" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Orderitem" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Orderitem" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Orderitem" ALTER COLUMN "orderId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Orderitem" ALTER COLUMN "stickerId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Order" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Order" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Order" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Review" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Review" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Review" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Review" ALTER COLUMN "stickerId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Shop" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Shop" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Shop" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Sticker" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Sticker" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Sticker" ALTER COLUMN "shopId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;