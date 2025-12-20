import { db } from "./index";
import { users, shops, stickers, roleEnum, stickerTypeEnum } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
    console.log("🌱 Seeding database...");

    try {
        // Clear existing data
        console.log("Cleaning up existing data...");
        await db.delete(stickers);
        await db.delete(shops);
        await db.delete(users);

        // Create Users
        console.log("Creating users...");
        const [adminUser] = await db
            .insert(users)
            .values({
                id: "user_admin_123",
                email: "admin@stickervalley.com",
                name: "Admin User",
                role: "ADMIN",
            })
            .returning();

        const [vendorUser] = await db
            .insert(users)
            .values({
                id: "user_vendor_123",
                email: "vendor@stickervalley.com",
                name: "Vendor User",
                role: "VENDOR",
            })
            .returning();

        const [customerUser] = await db
            .insert(users)
            .values({
                id: "user_customer_123",
                email: "customer@stickervalley.com",
                name: "Customer User",
                role: "CUSTOMER",
            })
            .returning();

        // Create Shop
        console.log("Creating shop...");
        const [shop] = await db
            .insert(shops)
            .values({
                name: "Cool Stickers Co.",
                description: "The best stickers in the valley!",
                userId: vendorUser.id,
            })
            .returning();

        // Create Stickers
        console.log("Creating stickers...");
        await db.insert(stickers).values([
            {
                name: "Retro Coder",
                description: "A cool retro coding sticker",
                price: "4.99",
                type: "PHYSICAL",
                stock: 100,
                shopId: shop.id,
                isPublished: true,
                images: ["https://placehold.co/400x400/png?text=Retro+Coder"],
            },
            {
                name: "Digital Nomad",
                description: "For the travelers",
                price: "2.99",
                type: "DIGITAL",
                stock: 0, // Digital items might not need stock, but schema has it.
                shopId: shop.id,
                isPublished: true,
                images: ["https://placehold.co/400x400/png?text=Digital+Nomad"],
            },
            {
                name: "Coffee & Code",
                description: "Essential fuel",
                price: "3.50",
                type: "PHYSICAL",
                stock: 50,
                shopId: shop.id,
                isPublished: true,
                images: ["https://placehold.co/400x400/png?text=Coffee+Code"],
            },
        ]);

        console.log("✅ Seeding completed successfully!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

seed();
