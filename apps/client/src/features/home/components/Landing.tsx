import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getStickers } from '@/features/stickers/api/sticker.api';
import StickerGrid from '@/features/stickers/components/StickerGrid';
import { Sparkles, ArrowRight } from 'lucide-react';

export function Landing() {
    const { data: stickers, isLoading } = useQuery({
        queryKey: ['landing-stickers'],
        queryFn: () => getStickers(),
    });

    const featuredStickers = stickers?.slice(0, 4) || [];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-20 pb-20 duration-700">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-indigo-600 py-24 text-white">
                <div className="absolute top-0 right-0 rotate-12 p-12 opacity-10">
                    <Sparkles className="h-64 w-64" />
                </div>

                <div className="relative z-10 container mx-auto space-y-8 px-6 text-center">
                    <h2 className="mx-auto max-w-4xl text-5xl leading-tight font-black tracking-tight md:text-7xl">
                        Your Universe,{' '}
                        <span className="bg-linear-to-br from-white to-indigo-600 bg-clip-text text-transparent">
                            Stuck
                        </span>{' '}
                        Everywhere.
                    </h2>
                    <p className="mx-auto max-w-2xl text-xl font-medium text-indigo-100 md:text-2xl">
                        Discover artist-made stickers or start your own shop. The most vibrant
                        creative community on the web.
                    </p>
                    <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                        <Link to="/stickers">
                            <Button
                                size="lg"
                                className="h-14 rounded-full bg-white px-10 text-lg font-bold text-indigo-600 shadow-xl shadow-indigo-900/20 hover:bg-indigo-50"
                            >
                                Explore Collection
                            </Button>
                        </Link>
                        <Link to="/stickers">
                            <Button
                                size="lg"
                                variant="default"
                                className="h-14 rounded-full border-indigo-400 bg-indigo-200 px-10 text-lg font-bold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-2xl"
                            >
                                Browse Categories
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Stickers Section */}
            <section className="container mx-auto space-y-12 px-4">
                <div className="flex items-end justify-between">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold tracking-tight text-gray-900">
                            Featured Stickers
                        </h3>
                        <p className="font-medium text-gray-500">
                            Handpicked favorites from our community
                        </p>
                    </div>
                    <Link
                        to="/stickers"
                        className="group flex items-center gap-2 font-bold text-indigo-600 hover:text-indigo-700"
                    >
                        View All{' '}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <StickerGrid stickers={featuredStickers} loading={isLoading} />
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4">
                <div className="relative space-y-8 overflow-hidden rounded-[2.5rem] bg-gray-900 p-12 text-center md:p-20">
                    <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-linear-to-br from-indigo-500/20 to-transparent" />
                    <h3 className="relative z-10 text-4xl font-bold text-white md:text-5xl">
                        Ready to start selling?
                    </h3>
                    <p className="relative z-10 mx-auto max-w-xl text-lg text-gray-400">
                        Join thousands of artists making a living doing what they love. Create your
                        shop in seconds.
                    </p>
                    <Link to="/shop" className="relative z-10 inline-block">
                        <Button
                            size="lg"
                            className="h-14 rounded-full bg-indigo-600 px-12 text-lg font-bold text-white hover:bg-indigo-700"
                        >
                            Open Your Shop
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
