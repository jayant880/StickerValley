import { api } from '@/lib/axios';

export const getWishlist = async () => {
    const res = await api.get('/wishlist');
    return res.data.success ? res.data.items : [];
};

export const addWishListItem = async (stickerId: string) => {
    const res = await api.post('/wishlist', { stickerId });
    return res.data.success ? res.data.message : 'Failed to add sticker to wishlist';
};

export const removeWishListItem = async (stickerId: string) => {
    const res = await api.delete(`/wishlist/${stickerId}`);
    return res.data.success ? res.data.message : 'Failed to remove sticker from wishlist';
};
