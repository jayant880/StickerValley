import StickerGrid from './StickerGrid'
import StickerFilters from './StickerFilters'
import { useStickerStore } from '../store/stickersStore'
import useStickers from '../hooks/useStickers'
import { Button } from '@/components/ui/button'

const Stickers = () => {
    const { filters, filterActions } = useStickerStore();
    const { stickers, isLoading, isError, error } = useStickers();


    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Stickers</h2>
                    <p className="text-red-500">{error?.message || "Failed to load stickers"}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }


    return (
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-screen">
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
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sticker Gallery</h1>
                        <p className="text-muted-foreground mt-2">Explore our collection of usage rights stickers.</p>
                    </div>
                </div>

                <StickerGrid stickers={stickers} loading={isLoading} />
            </main>
        </div>
    )
}

export default Stickers