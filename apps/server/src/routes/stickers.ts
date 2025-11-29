import express from "express";
import { db } from "../db";
import { stickers } from "../db/schema";
import { ilike, and, gte, lte, inArray, asc, desc } from "drizzle-orm";

const router = express.Router();

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
    return res.json({ data: result });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch stickers" });
  }
});

export default router;