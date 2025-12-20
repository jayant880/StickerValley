import { api } from '@/lib/axios';
import type { Shop, ShopWithRelations } from '@sticker-valley/shared-types';

export const getMyShop = async (): Promise<Shop | null> => {
    const res = await api.get('/shop/me');
    return res.data.success ? res.data.data : null;
};

export const getShopById = async (shopId: string): Promise<ShopWithRelations | null> => {
    const res = await api.get(`/shop/${shopId}`);
    return res.data.success ? res.data.data : null;
};

export const createShop = async (shopForm: {
    name: string;
    description: string;
}): Promise<Shop | null> => {
    const res = await api.post('/shop', shopForm);
    return res.data.success ? res.data.data : null;
};

export const updateShop = async (shopForm: {
    name?: string;
    description?: string;
}): Promise<Shop | null> => {
    const res = await api.put(`/shop`, shopForm);
    return res.data.success ? res.data.data : null;
};
