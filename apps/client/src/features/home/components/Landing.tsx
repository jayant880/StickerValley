import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getStickers } from "@/features/stickers/api/sticker.api";
import StickerGrid from "@/features/stickers/components/StickerGrid";
import { Sparkles, ArrowRight } from "lucide-react";

export function Landing() {
    const { data: stickers, isLoading } = useQuery({
        queryKey: ['landing-stickers'],
        queryFn: () => getStickers(),
    });

    const featuredStickers = stickers?.slice(0, 4) || [];

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden rounded-3xl bg-indigo-600 text-white">
                <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                    <Sparkles className="w-64 h-64" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
                        Your Universe, <span className="text-indigo-200">Stuck</span> Everywhere.
                    </h2>
                    <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mx-auto font-medium">
                        Discover artist-made stickers or start your own shop. The most vibrant creative community on the web.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link to="/stickers">
                            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 h-14 px-10 text-lg font-bold rounded-full shadow-xl shadow-indigo-900/20">
                                Explore Collection
                            </Button>
                        </Link>
                        <Link to="/stickers">
                            <Button size="lg" variant="outline" className="border-indigo-400 text-white hover:bg-indigo-500 h-14 px-10 text-lg font-bold rounded-full">
                                Browse Categories
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Stickers Section */}
            <section className="container mx-auto px-4 space-y-12">
                <div className="flex items-end justify-between">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold tracking-tight text-gray-900">Featured Stickers</h3>
                        <p className="text-gray-500 font-medium">Handpicked favorites from our community</p>
                    </div>
                    <Link to="/stickers" className="group flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700">
                        View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <StickerGrid stickers={featuredStickers} loading={isLoading} />
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4">
                <div className="bg-gray-900 rounded-[2.5rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-indigo-500/20 to-transparent pointer-events-none" />
                    <h3 className="text-4xl md:text-5xl font-bold text-white relative z-10">Ready to start selling?</h3>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto relative z-10">
                        Join thousands of artists making a living doing what they love. Create your shop in seconds.
                    </p>
                    <Link to="/shop" className="inline-block relative z-10">
                        <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700 h-14 px-12 text-lg font-bold rounded-full">
                            Open Your Shop
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
