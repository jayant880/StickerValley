ALTER TYPE "public"."OrderStatus" ADD VALUE 'CANCELLED';--> statement-breakpoint
CREATE TABLE "WishlistItem" (
	"id" text PRIMARY KEY NOT NULL,
	"wishlistId" text NOT NULL,
	"stickerId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WishList" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Review" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "Shop" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "Shop" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "Sticker" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_wishlistId_WishList_id_fk" FOREIGN KEY ("wishlistId") REFERENCES "public"."WishList"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_stickerId_Sticker_id_fk" FOREIGN KEY ("stickerId") REFERENCES "public"."Sticker"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WishList" ADD CONSTRAINT "WishList_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;