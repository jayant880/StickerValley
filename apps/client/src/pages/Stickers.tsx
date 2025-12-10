import { stickerService } from "@/service/stickerService"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { Sticker } from '@sticker-valley/shared-types';
import StickerFilters from "@/components/feature/product/StickerFilters";
import StickerGrid from "@/components/feature/product/StickerGrid";

const Stickers = () => {
    const [stickers, setStickers] = useState<Sticker[]>([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [maxPrice, setMaxPrice] = useState(5);
    const [minPrice, setMinPrice] = useState(0);
    const [selectedType, setSelectedType] = useState<"ALL" | "DIGITAL" | "PHYSICAL">("ALL");
    const [sort, setSort] = useState<'price_asc' | 'price_desc' | 'newest' | 'oldest'>("newest");

    useEffect(() => {
        const fetchStickers = async () => {
            setLoading(true);
            try {
                const stickersData = await stickerService.getStickers();
                setStickers(stickersData);
            } catch (error) {
                console.error("Failed to fetch stickers", error);
                toast.error("Failed to load stickers");
            } finally {
                setLoading(false);
            }
        }
        fetchStickers();
    }, []);

    const handleFilter = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const filteredSticker = await stickerService.getFilteredSticker(q, minPrice, maxPrice, selectedType === "ALL" ? undefined : selectedType, sort);
            setStickers(filteredSticker);
        } catch (error) {
            console.error("Failed to filter stickers", error);
            toast.error("Failed to filter stickers");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-screen">
            <StickerFilters
                q={q}
                setQ={setQ}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                sort={sort}
                setSort={setSort}
                onSubmit={handleFilter}
            />

            <main className="flex-1">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sticker Gallery</h1>
                        <p className="text-muted-foreground mt-2">Explore our collection of usage rights stickers.</p>
                    </div>
                </div>

                <StickerGrid stickers={stickers} loading={loading} />
            </main>
        </div>
    )
}

export default Stickers