import type { Sticker } from '@sticker-valley/shared-types';
import StickerCard from "./StickerCard";
import { StickerCardSkeleton } from "./StickerCardSkeleton";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { PackageOpen } from "lucide-react";

interface StickerGridProps {
    stickers: Sticker[];
    loading: boolean;
}

const StickerGrid = ({ stickers, loading }: StickerGridProps) => {
    if (loading) {

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <StickerCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!stickers || stickers.length === 0) {
        return (
            <Empty className="min-h-[400px]">
                <EmptyHeader>
                    <EmptyMedia variant="icon" className="mb-4 bg-muted/50 p-6 rounded-full">
                        <PackageOpen className="h-10 w-10 text-muted-foreground/70" />
                    </EmptyMedia>
                    <EmptyTitle className="text-xl">No stickers found</EmptyTitle>
                    <EmptyDescription className="max-w-xs mx-auto">
                        Try adjusting your price range or search filters to find what you're looking for.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }


    return (
        <div className="flex flex-wrap gap-6">
            {stickers.map((sticker) => (
                <div key={sticker.id} className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <StickerCard sticker={sticker} />
                </div>
            ))}
        </div>
    );
};

export default StickerGrid;
