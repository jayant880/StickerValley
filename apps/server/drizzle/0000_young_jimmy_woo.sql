CREATE TYPE "public"."OrderStatus" AS ENUM('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('ADMIN', 'VENDOR', 'CUSTOMER');--> statement-breakpoint
CREATE TABLE "CartItems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cartId" uuid NOT NULL,
	"stickerId" uuid NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Cart" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Cart_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "Orderitem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"orderId" uuid NOT NULL,
	"stickerId" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"totalAmount" numeric NOT NULL,
	"status" "OrderStatus" DEFAULT 'PENDING' NOT NULL,
	"paymentIntent" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"stickerId" uuid NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Shop" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"userId" uuid NOT NULL,
	CONSTRAINT "Shop_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "Sticker" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"images" text[],
	"price" numeric NOT NULL,
	"shopId" uuid NOT NULL,
	"isPublished" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatar" text,
	"role" "Role" DEFAULT 'CUSTOMER' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_cartId_Cart_id_fk" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CartItems" ADD CONSTRAINT "CartItems_stickerId_Sticker_id_fk" FOREIGN KEY ("stickerId") REFERENCES "public"."Sticker"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Orderitem" ADD CONSTRAINT "Orderitem_orderId_Order_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Orderitem" ADD CONSTRAINT "Orderitem_stickerId_Sticker_id_fk" FOREIGN KEY ("stickerId") REFERENCES "public"."Sticker"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Review" ADD CONSTRAINT "Review_stickerId_Sticker_id_fk" FOREIGN KEY ("stickerId") REFERENCES "public"."Sticker"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Sticker" ADD CONSTRAINT "Sticker_shopId_Shop_id_fk" FOREIGN KEY ("shopId") REFERENCES "public"."Shop"("id") ON DELETE no action ON UPDATE no action;