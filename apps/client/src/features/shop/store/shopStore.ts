import { create } from "zustand";

interface ShopStore {
    shopForm: { name: string; description: string };
    shopFormActions: {
        setName: (name: string) => void;
        setDescription: (description: string) => void;
    }
    clearShopForm: () => void;
}

const DEFAULT_SHOP_FORM: { name: string; description: string } = {
    name: "",
    description: "",
}

export const useShopStore = create<ShopStore>((set) => ({
    shopForm: DEFAULT_SHOP_FORM,
    shopFormActions: {
        setName: (name: string) => set((state) => ({ shopForm: { ...state.shopForm, name } })),
        setDescription: (description: string) => set((state) => ({ shopForm: { ...state.shopForm, description } })),
    },
    clearShopForm: () => set({ shopForm: DEFAULT_SHOP_FORM }),
}))
