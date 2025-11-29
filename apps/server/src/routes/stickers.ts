import express from "express";
import { db } from "../db";
import { shops, Sticker, stickers } from "../db/schema";
import { ilike, and, gte, lte, inArray, asc, desc, eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { randomUUID } from "crypto";

const router = express.Router();

export const requireVendor = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  const shop = await db.query.shops.findFirst({
    where: eq(shops.userId, userId.toString()),
  });
  if (!shop) {
    return res.status(403).json({ success: false, error: "Vendor shop required" });
  }
  req.body.shop = shop.id;
  next();
}


router.get("/", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 10);

  const minPrice = req.query.minPrice ? req.query.minPrice.toString() : "0";
  const maxPrice = req.query.maxPrice ? req.query.maxPrice.toString() : "1000";
  const search = req.query.q as string || "";
  const sort = req.query.sort || "newest";

  const typeQuery = req.query.type as string;
  const typeFilter = (typeQuery ? [typeQuery] : ["DIGITAL", "PHYSICAL"]) as ("DIGITAL" | "PHYSICAL")[];

  const sortMap = {
    'name_asc': asc(stickers.name),
    'name_desc': desc(stickers.name),
    'price_asc': asc(stickers.price),
    'price_desc': desc(stickers.price),
    'newest': desc(stickers.createdAt),
    'oldest': asc(stickers.createdAt),
  }

  const orderBy = sortMap[sort as keyof typeof sortMap] || desc(stickers.createdAt);

  const filter = [
    search ? ilike(stickers.name, `%${search}%`) : undefined,
    gte(stickers.price, minPrice),
    lte(stickers.price, maxPrice),
    inArray(stickers.type, typeFilter),
  ]

  try {
    const result = await db.query.stickers.findMany({
      where: and(...filter.filter(f => f !== undefined)),
      orderBy: orderBy,
      limit: limit,
      offset: (page - 1) * limit,
    });
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch stickers" });
  }
});

router.post("/", requireVendor, async (req, res) => {
  try {
    const { shop } = req.body;
    if (!shop) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { name, description, images, price, type, stock } = req.body;

    if (!name || !description || !images || !price || !type || !stock) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const newSticker: Sticker = {
      id: randomUUID(),
      name: name.toString() as string,
      description: description.toString() as string,
      images: images.toString() as string[],
      price: price.toString() as string,
      type: type.toString() as ("DIGITAL" | "PHYSICAL"),
      stock: Number(stock.toString()),
      shopId: shop.id,
      isPublished: false,
      createdAt: new Date(),
    }
    const result = await db.insert(stickers).values(newSticker);

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to create sticker" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ success: false, error: "sticker not found" });
    }
    const result = await db.query.stickers.findFirst({
      where: eq(stickers.id, id),
    });
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to fetch sticker" });
  }
});

router.put("/:id", requireVendor, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ success: false, error: "sticker not found" });
    }

    const { name, description, images, price, type, stock } = req.body;

    if (!name || !description || !images || !price || !type || !stock) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const updateSticker: Partial<Sticker> = {
      name: name.toString() as string,
      description: description.toString() as string,
      images: images.toString() as string[],
      price: price.toString() as string,
      type: type.toString() as ("DIGITAL" | "PHYSICAL"),
      stock: Number(stock.toString()),
    }

    const result = await db.update(stickers).set(updateSticker).where(eq(stickers.id, id));
    return res.json({ success: true, data: result });

  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to update sticker" });
  }
});


router.delete("/:id", requireVendor, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({ success: false, error: "sticker not found" });
    }
    const result = await db.delete(stickers).where(eq(stickers.id, id));
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to delete sticker" });
  }
})

export default router;