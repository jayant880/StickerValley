import StickerGrid from './StickerGrid';
import StickerFilters from './StickerFilters';
import { useStickerStore } from '../store/stickersStore';
import useStickers from '../hooks/useStickers';
import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

const Stickers = () => {
    const { filters, filterActions } = useStickerStore();
    const { stickers, pagination, isLoading, isError, error } = useStickers();

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

    const { page, totalPages } = pagination || { page: 1, totalPages: 1 };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        filterActions.setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <title>Sticker Valley | Stickers</title>
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

                    <div className="space-y-8">
                        <StickerGrid stickers={stickers} loading={isLoading} />

                        {totalPages > 1 && (
                            <Pagination className="mt-8">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(page - 1);
                                            }}
                                            className={
                                                page <= 1 ? 'pointer-events-none opacity-50' : ''
                                            }
                                        />
                                    </PaginationItem>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= page - 1 && pageNum <= page + 1)
                                        ) {
                                            return (
                                                <PaginationItem key={pageNum}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={pageNum === page}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handlePageChange(pageNum);
                                                        }}
                                                    >
                                                        {pageNum}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        } else if (pageNum === 2 || pageNum === totalPages - 1) {
                                            return (
                                                <PaginationItem key={pageNum}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }
                                        return null;
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(page + 1);
                                            }}
                                            className={
                                                page >= totalPages
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Stickers;
