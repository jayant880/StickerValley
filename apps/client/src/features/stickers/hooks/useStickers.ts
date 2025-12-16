import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStickerStore } from "../store/stickersStore";
import { createSticker, getFilteredStickers, getStickerById } from "../api/sticker.api";
import useDebounce from "./useDebounce";

export const useStickersQuery = () => {
    const { filters } = useStickerStore();
    const { q, minPrice, maxPrice, selectedType, sort } = filters;

    const debouncedQ = useDebounce(q, 500);
    const debouncedMinPrice = useDebounce(minPrice, 500);
    const debouncedMaxPrice = useDebounce(maxPrice, 500);

    return useQuery({
        queryKey: ['stickers', debouncedQ, debouncedMinPrice, debouncedMaxPrice, selectedType, sort],
        queryFn: () => getFilteredStickers(debouncedQ, debouncedMinPrice, debouncedMaxPrice, selectedType, sort),
        retry: 2,
        retryDelay: 1000,
    })
}

export const useStickerQuery = (id?: string) => {
    return useQuery({
        queryKey: ['sticker', id],
        queryFn: () => {
            if (!id) throw new Error("Sticker ID is required");
            return getStickerById(id);
        },
        enabled: !!id,
        retry: 2,
        retryDelay: 1000,
    });
};

export const useCreateSticker = () => {
    const queryClient = useQueryClient();
    const { stickerForm } = useStickerStore();

    return useMutation({
        mutationFn: () => createSticker(stickerForm),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stickers'] });
        },
        onError: (error: Error) => {
            console.error("Failed to create Sticker", error);
        },
    });
};

const useStickers = () => {
    const stickerQuery = useStickersQuery();

    return {
        stickers: stickerQuery.data || [],
        isLoading: stickerQuery.isLoading,
        error: stickerQuery.error,
        isError: stickerQuery.isError,
        useStickerQuery,
        useCreateSticker,
    }
}

export default useStickers;
