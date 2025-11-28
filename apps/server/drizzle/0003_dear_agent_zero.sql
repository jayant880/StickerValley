ALTER TABLE "User" ADD COLUMN "clerkId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_clerkId_unique" UNIQUE("clerkId");