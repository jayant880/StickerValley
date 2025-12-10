import { api } from "@/lib/axios";

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
    }
  },
};
