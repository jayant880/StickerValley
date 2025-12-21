import { create } from 'zustand';

interface FilterState {
    q: string;
    minPrice: number;
    maxPrice: number;
    selectedType: 'ALL' | 'DIGITAL' | 'PHYSICAL';
    sort: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
    page: number;
    limit: number;
}

interface StickerFormState {
    name: string;
    description: string;
    price: string;
    type: 'DIGITAL' | 'PHYSICAL';
    stock?: number;
    images: string[];
}

interface StickerStore {
    filters: FilterState;
    stickerForm: StickerFormState;
    filterActions: {
        setQ: (q: string) => void;
        setMinPrice: (minPrice: number) => void;
        setMaxPrice: (maxPrice: number) => void;
        setSelectedType: (selectedType: 'ALL' | 'DIGITAL' | 'PHYSICAL') => void;
        setSort: (sort: 'price_asc' | 'price_desc' | 'newest' | 'oldest') => void;
        setPage: (page: number) => void;
        setLimit: (limit: number) => void;
        resetFilters: () => void;
    };
    stickerFormActions: {
        setName: (name: string) => void;
        setDescription: (description: string) => void;
        setPrice: (price: string) => void;
        setType: (type: 'DIGITAL' | 'PHYSICAL') => void;
        setStock: (stock: number) => void;
        setImages: (images: string[]) => void;
        resetStickerForm: () => void;
    };
}

const DEFAULT_FILTERS: FilterState = {
    q: '',
    minPrice: 0,
    maxPrice: 100,
    selectedType: 'ALL',
    sort: 'newest',
    page: 1,
    limit: 8,
};

const DEFAULT_STICKER_FORM: StickerFormState = {
    name: '',
    description: '',
    price: '0',
    type: 'DIGITAL',
    stock: 0,
    images: [''],
};

export const useStickerStore = create<StickerStore>((set) => ({
    filters: DEFAULT_FILTERS,
    stickerForm: DEFAULT_STICKER_FORM,
    filterActions: {
        setQ: (q: string) =>
            set((state) => ({ ...state, filters: { ...state.filters, q, page: 1 } })),
        setMinPrice: (minPrice: number) =>
            set((state) => ({ ...state, filters: { ...state.filters, minPrice, page: 1 } })),
        setMaxPrice: (maxPrice: number) =>
            set((state) => ({ ...state, filters: { ...state.filters, maxPrice, page: 1 } })),
        setSelectedType: (selectedType: 'ALL' | 'DIGITAL' | 'PHYSICAL') =>
            set((state) => ({
                ...state,
                filters: { ...state.filters, selectedType, page: 1 },
            })),
        setSort: (sort: 'price_asc' | 'price_desc' | 'newest' | 'oldest') =>
            set((state) => ({ ...state, filters: { ...state.filters, sort, page: 1 } })),
        setPage: (page: number) =>
            set((state) => ({ ...state, filters: { ...state.filters, page } })),
        setLimit: (limit: number) =>
            set((state) => ({ ...state, filters: { ...state.filters, limit, page: 1 } })),
        resetFilters: () => set((state) => ({ ...state, filters: DEFAULT_FILTERS })),
    },
    stickerFormActions: {
        setName: (name: string) =>
            set((state) => ({ ...state, stickerForm: { ...state.stickerForm, name } })),
        setDescription: (description: string) =>
            set((state) => ({ ...state, stickerForm: { ...state.stickerForm, description } })),
        setPrice: (price: string) =>
            set((state) => ({ ...state, stickerForm: { ...state.stickerForm, price } })),
        setType: (type: 'DIGITAL' | 'PHYSICAL') =>
            set((state) => ({ ...state, stickerForm: { ...state.stickerForm, type } })),
        setStock: (stock: number) =>
            set((state) => ({ ...state, stickerForm: { ...state.stickerForm, stock } })),
        setImages: (images: string[]) =>
            set((state) => ({ ...state, stickerForm: { ...state.stickerForm, images } })),
        resetStickerForm: () => set({ stickerForm: DEFAULT_STICKER_FORM }),
    },
}));
