import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';


export async function handleUserToDatabase(clerkUser: any) {
    const email = clerkUser.email_addresses?.[0]?.email_address || clerkUser.emailAddresses?.[0]?.emailAddress || "example@example.com";

    const firstName = clerkUser.first_name || clerkUser.firstName || "";
    const lastName = clerkUser.last_name || clerkUser.lastName || "";
    const imageUrl = clerkUser.image_url || clerkUser.imageUrl || "";

    if (!email) {
        console.warn(`User ${clerkUser.id} has no email address. Skipping database sync.`);
        return;
    }

    const userData = {
        id: clerkUser.id,
        email: email,
        name: `${firstName} ${lastName}`.trim(),
        avatarUrl: imageUrl,
        role: 'CUSTOMER' as const,

    }
    await db
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
    console.log(`Synced user ${userData.id} to database`);
}

async function deleteUserFromDatabase(userId: string) {
    await db.delete(users).where(eq(users.id, userId));
    console.log(`Deleted user ${userId} from database`);
}