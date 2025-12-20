import { db } from '../db';
import { carts, users, wishlists } from '../db/schema';
import { eq } from 'drizzle-orm';


export async function handleUserToDatabase(clerkUser: any) {
    const email = clerkUser.email_addresses?.[0]?.email_address || clerkUser.emailAddresses?.[0]?.emailAddress || "example@example.com";

    const firstName = clerkUser.first_name || clerkUser.firstName || "";
    const lastName = clerkUser.last_name || clerkUser.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    const imageUrl = clerkUser.image_url || clerkUser.imageUrl || "";

    if (!email) {
        console.warn(`User ${clerkUser.id} has no email address. Skipping database sync.`);
        return;
    }

    const userData = {
        id: clerkUser.id,
        email: email,
        name: fullName,
        avatarUrl: imageUrl,
        role: 'CUSTOMER' as const,

    }
    await db.transaction(async (tx) => {
        await tx
            .insert(users)
            .values(userData)
            .onConflictDoUpdate({
                target: users.id,
                set: {
                    email: userData.email,
                    name: userData.name,
                    avatarUrl: userData.avatarUrl,
                    role: userData.role,
                }
            });

        const existingCart = await tx.query.carts.findFirst({ where: eq(carts.userId, userData.id) });
        if (!existingCart) await tx.insert(carts).values({ userId: userData.id });

        const existingWishlist = await tx.query.wishlists.findFirst({ where: eq(wishlists.userId, userData.id) });
        if (!existingWishlist) await tx.insert(wishlists).values({ userId: userData.id });
    });
    console.log(`Synced user ${userData.id} and ensured cart/wishlist in database`);
}

async function deleteUserFromDatabase(userId: string) {
    await db.delete(users).where(eq(users.id, userId));
    console.log(`Deleted user ${userId} from database`);
}