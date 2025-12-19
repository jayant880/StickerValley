import useWishlist from "../hooks/useWishlist";
import StickerGrid from "@/features/stickers/components/StickerGrid";
import { Heart, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";

const Wishlist = () => {
    const { wishlist, isLoading, error } = useWishlist();

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 max-w-md mx-auto">
                    <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
                    <p>{error.message}</p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-white p-8 md:p-12 rounded-3xl border shadow-sm mb-12">
                <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 pointer-events-none">
                    <Heart className="w-64 h-64 fill-current" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-3 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                                Personal Collection
                            </Badge>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                            Your <span className="text-indigo-600">Wishlist</span>
                        </h1>
                        <p className="text-gray-500 font-medium text-lg max-w-lg">
                            Keep track of all the stickers you love. We'll let you know if any of them go on sale!
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Link to="/stickers">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 shadow-lg shadow-indigo-200">
                                Explore More <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="space-y-8">
                {wishlist && wishlist.length > 0 && (
                    <div className="flex items-center gap-2 mb-6">
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                            {wishlist.length} {wishlist.length === 1 ? 'Sticker' : 'Stickers'} Saved
                        </span>
                    </div>
                )}

                {!isLoading && (!wishlist || wishlist.length === 0) ? (
                    <div className="bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200 py-24 text-center space-y-8">
                        <div className="bg-white w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-xl rotate-3">
                            <Heart className="w-12 h-12 text-gray-200" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h3>
                            <p className="text-gray-500 font-medium max-w-xs mx-auto">
                                Start exploring our collection and tap the heart icon to save stickers you love.
                            </p>
                        </div>
                        <Link to="/stickers">
                            <Button variant="outline" size="lg" className="rounded-full px-8 border-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                                <Home className="w-4 h-4 mr-2" /> Return to Shop
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <StickerGrid stickers={wishlist || []} loading={isLoading} />
                )}
            </div>
        </div>
    );
};

export default Wishlist;