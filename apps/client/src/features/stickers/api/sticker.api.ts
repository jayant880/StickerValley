import { api } from '@/lib/axios';
import type {
    Sticker,
    StickerWithRelations,
    PaginatedResponse,
} from '@sticker-valley/shared-types';

export const getStickers = async (): Promise<Sticker[]> => {
    const res = await api.get('/stickers');
    return res.data.success ? res.data.data : [];
};

export const getFilteredStickers = async (
    q?: string,
    minPrice?: number,
    maxPrice?: number,
    selectedType?: 'ALL' | 'DIGITAL' | 'PHYSICAL',
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest',
    page: number = 1,
    limit: number = 10,
): Promise<PaginatedResponse<Sticker>> => {
    const params = new URLSearchParams();
    if (q && q.trim()) params.set('q', q.trim());
    if (minPrice !== undefined) params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.set('maxPrice', maxPrice.toString());
    if (selectedType && selectedType !== 'ALL') params.set('type', selectedType);
    if (sort) params.set('sort', sort);
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    const res = await api.get('/stickers', { params });
    return res.data;
};

export const getStickerById = async (id: string): Promise<StickerWithRelations | null> => {
    const res = await api.get(`/stickers/${id}`);
    return res.data.success ? res.data.data : null;
};

export const createSticker = async (sticker: Partial<Sticker>): Promise<Sticker | null> => {
    const res = await api.post('/stickers', sticker);
    return res.data.success ? res.data.data : null;
};

export const updateSticker = async (sticker: Partial<Sticker>, stickerId: string) => {
    const res = await api.put(`/stickers/${stickerId}`, sticker);
    return res.data.success ? res.data.data : null;
};

export const deleteSticker = async (id: string): Promise<boolean> => {
    const res = await api.delete(`/stickers/${id}`);
    return res.data.success;
};
