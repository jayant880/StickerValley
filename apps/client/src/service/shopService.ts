import { api } from "@/lib/axios";

const shopService = {
    getMyShop: async () => {
        try {
            const res = await api.get("/shop/me");
            return res.data.shop;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getShopById: async (shopId: string) => {
        try {
            const res = await api.get(`/shop/${shopId}`);
            return res.data.shop;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    createShop: async (shopForm: { name: string, description: string }) => {
        try {
            const res = await api.post("/shop", shopForm);
            return res.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
}

export default shopService;