import useWishlist from '../hooks/useWishlist';
import StickerGrid from '@/features/stickers/components/StickerGrid';
import { Heart, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';

const Wishlist = () => {
    const { wishlist, isLoading, error } = useWishlist();

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50 p-6 text-red-600">
                    <h2 className="mb-2 text-xl font-bold">Oops! Something went wrong</h2>
                    <p>{error.message}</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <title>Sticker Valley | Wishlist</title>
            <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto max-w-7xl px-4 py-12 duration-700">
                {/* Header Section */}
                <div className="relative mb-12 overflow-hidden rounded-3xl border bg-white p-8 shadow-sm md:p-12">
                    <div className="pointer-events-none absolute top-0 right-0 -rotate-12 p-8 opacity-5">
                        <Heart className="h-64 w-64 fill-current" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
                        <div className="space-y-3 text-center md:text-left">
                            <div className="mb-2 flex items-center justify-center gap-3 md:justify-start">
                                <Badge
                                    variant="secondary"
                                    className="rounded-full border-none bg-indigo-50 px-4 py-1 text-xs font-bold tracking-wider text-indigo-700 uppercase hover:bg-indigo-100"
                                >
                                    Personal Collection
                                </Badge>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                                Your <span className="text-indigo-600">Wishlist</span>
                            </h1>
                            <p className="max-w-lg text-lg font-medium text-gray-500">
                                Keep track of all the stickers you love. We'll let you know if any
                                of them go on sale!
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <Link to="/stickers">
                                <Button
                                    size="lg"
                                    className="rounded-full bg-indigo-600 px-8 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                                >
                                    Explore More <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-8">
                    {wishlist && wishlist.length > 0 && (
                        <div className="mb-6 flex items-center gap-2">
                            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">
                                {wishlist.length} {wishlist.length === 1 ? 'Sticker' : 'Stickers'}{' '}
                                Saved
                            </span>
                        </div>
                    )}

                    {!isLoading && (!wishlist || wishlist.length === 0) ? (
                        <div className="space-y-8 rounded-[3rem] border-2 border-dashed border-gray-200 bg-gray-50/50 py-24 text-center">
                            <div className="mx-auto flex h-24 w-24 rotate-3 items-center justify-center rounded-3xl bg-white shadow-xl">
                                <Heart className="h-12 w-12 text-gray-200" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Your wishlist is empty
                                </h3>
                                <p className="mx-auto max-w-xs font-medium text-gray-500">
                                    Start exploring our collection and tap the heart icon to save
                                    stickers you love.
                                </p>
                            </div>
                            <Link to="/stickers">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full border-2 px-8 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    <Home className="mr-2 h-4 w-4" /> Return to Shop
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <StickerGrid stickers={wishlist || []} loading={isLoading} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Wishlist;
