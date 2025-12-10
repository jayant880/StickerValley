import { api } from "@/lib/axios";
import type { Shop, Sticker } from "@sticker-valley/shared-types";

type StickerWithShop = Sticker & { shop: Shop };

export const stickerService = {
  getStickers: async () => {
    try {
      const res = await api.get("/stickers");
      if (res.data.success) {
        return res.data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
    }
  },
  getFilteredSticker: async (
    q: string,
    minPrice?: number,
    maxPrice?: number,
    type?: undefined | "DIGITAL" | "PHYSICAL",
    sort?: "price_asc" | "price_desc" | "newest" | "oldest"
  ) => {
    try {
      let url = "/stickers?q=" + q;
      if (minPrice) {
        url += `&minPrice=${minPrice}`;
      }
      if (maxPrice) {
        url += `&maxPrice=${maxPrice}`;
      }
      if (type) {
        url += `&type=${type}`;
      }
      if (sort) {
        url += `&sort=${sort}`;
      }
      const res = await api.get(url);
      if (res.data.success) {
        return res.data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getStickerById: async (id: string): Promise<StickerWithShop> => {
    try {
      const res = await api.get("/stickers/" + id);
      if (res.data.success) {
        return res.data.data;
      } else {
        throw new Error("Sticker not found");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
