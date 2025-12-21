import { db } from "./index";
import { users, shops, stickers } from "./schema";

async function seed() {
    console.log("🌱 Seeding database...");

    try {
        console.log("Cleaning up existing data...");
        await db.delete(stickers);
        await db.delete(shops);
        await db.delete(users);

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

        const [vendor1] = await db
            .insert(users)
            .values({
                id: "user_vendor_123",
                email: "jane@pixelperfect.com",
                name: "Jane Pixel",
                role: "VENDOR",
            })
            .returning();

        const [vendor2] = await db
            .insert(users)
            .values({
                id: "user_vendor_456",
                email: "mark@retrovibes.com",
                name: "Mark Retro",
                role: "VENDOR",
            })
            .returning();

        const [customerUser] = await db
            .insert(users)
            .values({
                id: "user_customer_123",
                email: "customer@stickervalley.com",
                name: "Happy Customer",
                role: "CUSTOMER",
            })
            .returning();

        console.log("Creating shops...");
        const [shop1] = await db
            .insert(shops)
            .values({
                name: "Pixel Perfect",
                description: "High quality cute stickers for your daily needs!",
                userId: vendor1.id,
            })
            .returning();

        const [shop2] = await db
            .insert(shops)
            .values({
                name: "Retro Vibes",
                description: "Nostalgic and vibey stickers for your laptop.",
                userId: vendor2.id,
            })
            .returning();

        console.log("Creating stickers...");

        // Shop 1: Pixel Perfect Stickers (First 10 images)
        await db.insert(stickers).values([
            {
                name: "Cute Cat Pal",
                description: "Adorable cat sticker for your collection.",
                price: "3.99",
                type: "PHYSICAL",
                stock: 50,
                shopId: shop1.id,
                isPublished: true,
                images: ["https://i.ibb.co/Z1bYM43S/cute-sticker-1.png"],
            },
            {
                name: "Happy Doggo",
                description: "A very good boy to stick on your laptop.",
                price: "4.50",
                type: "PHYSICAL",
                stock: 25,
                shopId: shop1.id,
                isPublished: true,
                images: ["https://i.ibb.co/27FH4JBp/cute-sticker-2.png"],
            },
            {
                name: "Sleepy Bunny",
                description: "Perfect for nap time vibes.",
                price: "2.99",
                type: "DIGITAL",
                stock: 0,
                shopId: shop1.id,
                isPublished: true,
                images: ["https://i.ibb.co/CpkG0ptD/cute-sticker-3.png"],
            },
            {
                name: "Coding Hamster",
                description: "He codes while you sleep.",
                price: "5.00",
                type: "PHYSICAL",
                stock: 10,
                shopId: shop1.id,
                isPublished: true,
                images: ["https://i.ibb.co/5xgx0XJ9/cute-sticker-4.png"],
            },
            {
                name: "Magic Potion",
                description: "Add some magic to your day.",
                price: "3.99",
                type: "PHYSICAL",
                stock: 100,
                shopId: shop1.id,
                isPublished: true,
                images: ["https://i.ibb.co/whgFjDFM/cute-sticker-5.png"],
            },
            {
                name: "Starry Night",
                description: "A little piece of the night sky.",
                price: "4.25",
                type: "PHYSICAL",
                stock: 60,
                shopId: shop1.id,
                isPublished: true,
                images: ["https://i.ibb.co/PZqC08bS/cute-sticker-6.png"],
            },
            {
                name: "Space Rocket",
                description: "To the moon and beyond!",
                price: "3.50",
                type: "DIGITAL",
                stock: 0,
                shopId: shop1.id,
                isPublished: true,
                images: ["https://i.ibb.co/SX7R2wbB/cute-sticker-7.png"],
            },
            {
                name: "Coffee Lover",
                description: "But first, coffee.",
                price: "3.00",
                type: "PHYSICAL",
                stock: 45,
                shopId: shop1.id,
                isPublished: true,
                images: ["https://i.ibb.co/gbqpMby7/cute-sticker-8.png"],
            },
            {
                name: "Rainbow Cloud",
                description: "Every cloud has a rainbow lining.",
                price: "4.00",
                type: "PHYSICAL",
                stock: 30,
                shopId: shop1.id,
                isPublished: true,
                images: ["https://i.ibb.co/fVv0GLt3/cute-sticker-9.png"],
            },
            {
                name: "Pixel Heart",
                description: "Show some love in 8-bit.",
                price: "2.50",
                type: "PHYSICAL",
                stock: 0, // Out of stock test
                shopId: shop1.id,
                isPublished: true,
                images: ["https://i.ibb.co/gQQkcQq/cute-sticker-10.png"],
            },
        ]);

        // Shop 2: Retro Vibes Stickers (Next 10 images)
        await db.insert(stickers).values([
            {
                name: "Retro Gameboy",
                description: "Classic handheld gaming.",
                price: "5.99",
                type: "PHYSICAL",
                stock: 15,
                shopId: shop2.id,
                isPublished: true,
                images: ["https://i.ibb.co/5hbwzT45/cute-sticker-11.png"],
            },
            {
                name: "Vaporwave Sun",
                description: "Aesthetics only.",
                price: "4.99",
                type: "DIGITAL",
                stock: 0,
                shopId: shop2.id,
                isPublished: true,
                images: ["https://i.ibb.co/xq7DYbb1/cute-sticker-12.png"],
            },
            {
                name: "Neon City",
                description: "Cyberpunk vibes.",
                price: "6.50",
                type: "PHYSICAL",
                stock: 8,
                shopId: shop2.id,
                isPublished: true,
                images: ["https://i.ibb.co/Z6T02JsL/cute-sticker-13.png"],
            },
            {
                name: "Synthwave Car",
                description: "Driving into the sunset.",
                price: "5.50",
                type: "PHYSICAL",
                stock: 20,
                shopId: shop2.id,
                isPublished: true,
                images: ["https://i.ibb.co/yFr5W0pp/cute-sticker-14.png"],
            },
            {
                name: "Retro Cassette",
                description: "Mixtape memories.",
                price: "3.99",
                type: "PHYSICAL",
                stock: 40,
                shopId: shop2.id,
                isPublished: true,
                images: ["https://i.ibb.co/WNjTnP4k/cute-sticker-15.png"],
            },
            {
                name: "Floppy Disk",
                description: "Save your progress.",
                price: "3.50",
                type: "PHYSICAL",
                stock: 0, // Check "Out of Stock" badge
                shopId: shop2.id,
                isPublished: true,
                images: ["https://i.ibb.co/j9VfWwRz/cute-sticker-16.png"],
            },
            {
                name: "Arcade Machine",
                description: "Insert coin to play.",
                price: "7.00",
                type: "PHYSICAL",
                stock: 5,
                shopId: shop2.id,
                isPublished: true,
                images: ["https://i.ibb.co/G3chJFb4/cute-sticker-17.png"],
            },
            {
                name: "Pixel Sword",
                description: "It's dangerous to go alone.",
                price: "4.50",
                type: "PHYSICAL",
                stock: 33,
                shopId: shop2.id,
                isPublished: true,
                images: ["https://i.ibb.co/KRTn9zN/cute-sticker-18.png"],
            },
            {
                name: "Glitch Art",
                description: "It's not a bug, it's a feature.",
                price: "5.00",
                type: "DIGITAL",
                stock: 0,
                shopId: shop2.id,
                isPublished: true,
                images: ["https://i.ibb.co/0jrjm8Bz/cute-sticker-19.png"],
            },
            {
                name: "Cyber Cat",
                description: "The future is meow.",
                price: "6.00",
                type: "PHYSICAL",
                stock: 12,
                shopId: shop2.id,
                isPublished: true,
                images: ["https://i.ibb.co/q3ZFLQFy/cute-sticker-20.png"],
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
