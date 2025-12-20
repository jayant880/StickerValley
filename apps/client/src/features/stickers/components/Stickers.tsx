import StickerGrid from './StickerGrid';
import StickerFilters from './StickerFilters';
import { useStickerStore } from '../store/stickersStore';
import useStickers from '../hooks/useStickers';
import { Button } from '@/components/ui/button';

const Stickers = () => {
    const { filters, filterActions } = useStickerStore();
    const { stickers, isLoading, isError, error } = useStickers();

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                    <h2 className="mb-2 text-xl font-semibold text-red-600">
                        Error Loading Stickers
                    </h2>
                    <p className="text-red-500">{error?.message || 'Failed to load stickers'}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4 rounded bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto flex min-h-screen flex-col gap-8 px-4 py-8 duration-700 md:flex-row">
            <StickerFilters
                q={filters.q}
                setQ={filterActions.setQ}
                minPrice={filters.minPrice}
                setMinPrice={filterActions.setMinPrice}
                maxPrice={filters.maxPrice}
                setMaxPrice={filterActions.setMaxPrice}
                selectedType={filters.selectedType}
                setSelectedType={filterActions.setSelectedType}
                sort={filters.sort}
                setSort={filterActions.setSort}
                onSubmit={(e) => e.preventDefault()}
                onReset={filterActions.resetFilters}
            />

            <main className="flex-1">
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h1 className="text-foreground text-3xl font-bold tracking-tight">
                            Sticker Gallery
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Explore our collection of usage rights stickers.
                        </p>
                    </div>
                </div>

                <StickerGrid stickers={stickers} loading={isLoading} />
            </main>
        </div>
    );
};

export default Stickers;
