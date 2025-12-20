import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { useParams, useNavigate, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useAuth } from '@clerk/clerk-react';
import { ShoppingCart, Zap, Store, Calendar, Check, Trash2 } from 'lucide-react';
import useStickers from '../hooks/useStickers';
import useCart from '@/features/cart/hooks/useCart';
import ReviewList from '@/features/review/components/ReviewList';
import { useMemo } from 'react';
import EditStickerDialog from './EditStickerDialog';
import DeleteStickerDialog from './DeleteStickerDialog';

const StickerDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { useStickerQuery } = useStickers();
    const { data: sticker, isLoading, isError, error } = useStickerQuery(id);
    const { isSignedIn, userId } = useAuth();
    const { cart, addToCart, removeCartItem, isAdding, isRemoving } = useCart();

    const isInCart = useMemo(() => {
        return cart?.items?.some((item) => item.stickerId === sticker?.id) || false;
    }, [cart, sticker?.id]);

    const handleCartToggle = async () => {
        if (!isSignedIn) {
            toast.error('Please sign in to manage your cart');
            return;
        }
        if (!sticker?.id) return;

        if (isInCart) {
            removeCartItem(
                { stickerId: sticker.id },
                {
                    onSuccess: () => {
                        toast.success('Removed from cart');
                    },
                    onError: () => {
                        toast.error('Failed to remove from cart');
                    },
                },
            );
        } else {
            addToCart(
                { stickerId: sticker.id },
                {
                    onSuccess: () => {
                        toast.success('Added to cart', {
                            action: {
                                label: 'View Cart',
                                onClick: () => navigate('/cart'),
                            },
                        });
                    },
                    onError: () => {
                        toast.error('Failed to add to cart');
                    },
                },
            );
        }
    };

    const handleBuyNow = async () => {
        if (!isSignedIn) {
            toast.error('Please sign in to buy');
            return;
        }
        if (!sticker?.id) return;

        if (isInCart) {
            navigate('/cart');
            return;
        }

        addToCart(
            { stickerId: sticker.id },
            {
                onSuccess: () => {
                    toast.success('Added to cart');
                    navigate('/cart');
                },
                onError: () => {
                    toast.error('Failed to buy');
                },
            },
        );
    };

    const isCartLoading = isAdding || isRemoving;

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <Spinner className="mb-4 h-12 w-12 text-indigo-600" />
                <p className="animate-pulse text-xl font-medium text-gray-500">
                    Loading sticker details...
                </p>
            </div>
        );
    }

    if (isError || !sticker) {
        return (
            <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-8 text-center">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Sticker Not Found</h1>
                <p className="mb-6 text-gray-500">
                    {error?.message || 'The sticker you are looking for does not exist.'}
                </p>
                <Button onClick={() => navigate('/stickers')} variant="outline">
                    Browse Stickers
                </Button>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto max-w-7xl px-4 py-12 duration-700">
            <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
                <div className="space-y-4">
                    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-xs">
                        <Carousel className="h-fit w-full">
                            <CarouselContent>
                                {sticker.images?.map((image: string, index: number) => (
                                    <CarouselItem
                                        key={index}
                                        className="flex h-full w-full items-center justify-center p-4"
                                    >
                                        <div className="relative flex h-full w-full items-center justify-center">
                                            <img
                                                src={image}
                                                alt={`${sticker.name} view ${index + 1}`}
                                                className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-4" />
                            <CarouselNext className="right-4" />
                        </Carousel>
                    </div>
                </div>

                <div className="flex flex-col space-y-8">
                    {isSignedIn && userId === sticker.shop?.userId && (
                        <div className="flex flex-wrap gap-3">
                            <EditStickerDialog sticker={sticker} />
                            <DeleteStickerDialog
                                stickerId={sticker.id}
                                stickerName={sticker.name}
                            />
                        </div>
                    )}
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <Badge
                                variant="secondary"
                                className="bg-indigo-50 px-3 py-1 text-indigo-700 hover:bg-indigo-100"
                            >
                                {sticker.type}
                            </Badge>
                            {sticker.type === 'PHYSICAL' && sticker.stock === 0 && (
                                <Badge
                                    variant="destructive"
                                    className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                >
                                    Out of Stock
                                </Badge>
                            )}
                        </div>
                        <h1 className="mb-4 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 md:text-5xl">
                            {sticker.name}
                        </h1>
                        <p className="text-3xl font-bold text-indigo-600">
                            ${Number(sticker.price).toFixed(2)}
                        </p>
                    </div>

                    <div className="prose prose-gray max-w-none">
                        <p className="text-lg leading-relaxed text-gray-600">
                            {sticker.description}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Store className="h-5 w-5 text-gray-400" />
                                <span>
                                    Shop:{' '}
                                    <Link
                                        to={`/shop/${sticker.shop?.id}`}
                                        className="font-semibold text-indigo-600 hover:underline"
                                    >
                                        {sticker.shop?.name}
                                    </Link>
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <span>
                                    Released:{' '}
                                    <span className="font-medium text-gray-900">
                                        {new Date(sticker.createdAt).toLocaleDateString()}
                                    </span>
                                </span>
                            </div>
                            {sticker.type === 'PHYSICAL' && (
                                <div className="col-span-2 flex items-center gap-2 text-gray-600">
                                    <div
                                        className={`h-2 w-2 rounded-full ${sticker.stock && sticker.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                    />
                                    <span>
                                        Availability:
                                        {sticker.stock && sticker.stock > 0 ? (
                                            <span className="ml-1 font-medium text-gray-900">
                                                {sticker.stock} in stock
                                            </span>
                                        ) : (
                                            <span className="ml-1 font-medium text-red-600">
                                                Currently unavailable
                                            </span>
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                size="lg"
                                className={`group/cart h-14 flex-1 font-semibold transition-all duration-300 ${
                                    isInCart
                                        ? 'border-green-600 bg-green-600 text-white hover:border-red-500 hover:bg-red-500'
                                        : 'border-2 border-gray-200 bg-white text-gray-900 hover:border-gray-900 hover:bg-gray-50'
                                }`}
                                onClick={handleCartToggle}
                                disabled={
                                    isCartLoading ||
                                    (sticker.type === 'PHYSICAL' && sticker.stock === 0)
                                }
                            >
                                {isCartLoading ? (
                                    <Spinner className="mr-2 h-5 w-5" />
                                ) : isInCart ? (
                                    <>
                                        <Check className="mr-2 h-5 w-5 group-hover/cart:hidden" />
                                        <Trash2 className="mr-2 hidden h-5 w-5 group-hover/cart:block" />
                                    </>
                                ) : (
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                )}
                                {isCartLoading ? 'Wait...' : isInCart ? 'Added' : 'Add to Cart'}
                            </Button>
                            <Button
                                size="lg"
                                className="h-14 flex-1 bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                                onClick={handleBuyNow}
                                disabled={
                                    isCartLoading ||
                                    (sticker.type === 'PHYSICAL' && sticker.stock === 0)
                                }
                            >
                                {isCartLoading ? (
                                    <Spinner className="mr-2 h-5 w-5" />
                                ) : (
                                    <Zap className="mr-2 h-5 w-5" />
                                )}
                                {isInCart ? 'Checkout Now' : 'Buy Now'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-16">
                <ReviewList stickerId={sticker.id} />
            </div>
        </div>
    );
};

export default StickerDetail;
