import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/express";
import { handleUserToDatabase } from "../webhooks/clerk";

export async function getOrSyncUser(userId: string) {
    // Check if user exists in DB
    let user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    if (!user) {
        try {
            // If not in DB, fetch from Clerk
            const clerkUser = await clerkClient.users.getUser(userId);
            // Sync to DB
            await handleUserToDatabase(clerkUser);
            // Fetch again after sync
            user = await db.query.users.findFirst({
                where: eq(users.id, userId)
            });
        } catch (error) {
            console.error("Error syncing user:", error);
            throw new Error("Error syncing user data");
        }
    }

    return user;
}
