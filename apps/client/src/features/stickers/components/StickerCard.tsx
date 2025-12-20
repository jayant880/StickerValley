import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import useCart from '@/features/cart/hooks/useCart';
import useWishlist from '@/features/wishlist/hooks/useWishlist';
import { useAuth } from '@clerk/clerk-react';
import type { Sticker } from '@sticker-valley/shared-types';
import { ShoppingCart, Zap, Check, Trash2, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useMemo } from 'react';

const StickerCard = ({ sticker }: { sticker: Partial<Sticker> }) => {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();
    const { cart, addToCart, removeCartItem, isAdding, isRemoving } = useCart();
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const isInCart = useMemo(() => {
        return cart?.items?.some((item) => item.stickerId === sticker.id) || false;
    }, [cart, sticker.id]);

    const isInWishlist = useMemo(() => {
        return wishlist?.some((item) => item.id === sticker.id) || false;
    }, [wishlist, sticker.id]);

    const imageSrc =
        sticker.images && sticker.images.length > 0
            ? sticker.images[0]
            : 'https://placehold.co/400x400/png?text=' + (sticker.name || 'Sticker');

    const handleCartToggle = async () => {
        if (!isSignedIn) {
            toast.error('Please sign in to manage your cart');
            return;
        }
        if (!sticker.id) return;

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

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isSignedIn) {
            toast.error('Please sign in to manage your wishlist');
            return;
        }
        if (!sticker.id) return;

        if (isInWishlist) {
            removeFromWishlist.mutate(sticker.id, {
                onSuccess: () => toast.success('Removed from wishlist'),
                onError: () => toast.error('Failed to remove from wishlist'),
            });
        } else {
            addToWishlist.mutate(sticker.id, {
                onSuccess: () => toast.success('Added to wishlist'),
                onError: () => toast.error('Failed to add to wishlist'),
            });
        }
    };

    const handleBuyNow = async () => {
        if (!isSignedIn) {
            toast.error('Please sign in to buy');
            return;
        }
        if (!sticker.id) return;

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

    const isLoading =
        isAdding || isRemoving || addToWishlist.isPending || removeFromWishlist.isPending;

    return (
        <Card className="group border-border/50 bg-card hover:bg-card/80 relative flex h-full min-w-64 flex-col overflow-hidden transition-all duration-300">
            <div className="absolute top-2 right-2 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className={`rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                >
                    <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </Button>
            </div>
            <CardHeader className="p-0">
                <div className="bg-muted/20 relative w-full overflow-hidden pt-[100%]">
                    <img
                        src={imageSrc}
                        alt={sticker.name || 'Sticker'}
                        className="absolute top-0 left-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    />
                    {sticker.type === 'PHYSICAL' && sticker.stock === 0 && (
                        <div className="absolute top-2 left-2">
                            <Badge variant="destructive" className="shadow-sm">
                                Out of Stock
                            </Badge>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-3 p-4">
                <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <Badge
                            variant="secondary"
                            className="shrink-0 text-xs font-normal tracking-wider uppercase"
                        >
                            {sticker.type || 'Unknown'}
                        </Badge>
                        <span className="text-primary shrink-0 text-lg font-bold tabular-nums">
                            ${sticker.price ? Number(sticker.price).toFixed(2) : '0.00'}
                        </span>
                    </div>
                    <Link to={`/stickers/${sticker.id}`}>
                        <CardTitle className="group-hover:text-primary line-clamp-1 text-base font-semibold transition-colors">
                            {sticker.name || 'Untitled'}
                        </CardTitle>
                    </Link>
                    <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                        {sticker.description || 'No description available'}
                    </CardDescription>
                </div>
            </CardContent>

            <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
                <Button
                    variant={isInCart ? 'default' : 'outline'}
                    size="sm"
                    className={`w-full transition-all duration-300 ${isInCart ? 'group/cart bg-green-600 text-white hover:bg-red-500' : ''}`}
                    onClick={handleCartToggle}
                    disabled={isLoading || (sticker.type === 'PHYSICAL' && sticker.stock === 0)}
                >
                    {isAdding || isRemoving ? (
                        <Spinner className="mr-2 h-4 w-4" />
                    ) : isInCart ? (
                        <>
                            <Check className="mr-2 h-4 w-4 group-hover/cart:hidden" />
                            <Trash2 className="mr-2 hidden h-4 w-4 group-hover/cart:block" />
                        </>
                    ) : (
                        <ShoppingCart className="mr-2 h-4 w-4" />
                    )}
                    {isAdding || isRemoving ? 'Wait...' : isInCart ? 'Added' : 'Cart'}
                </Button>
                <Button
                    size="sm"
                    className="w-full"
                    onClick={handleBuyNow}
                    disabled={isLoading || (sticker.type === 'PHYSICAL' && sticker.stock === 0)}
                >
                    <Zap className="mr-2 h-4 w-4" />
                    {isAdding || isRemoving ? (
                        <Spinner className="mr-2 h-4 w-4" />
                    ) : isInCart ? (
                        'Checkout'
                    ) : (
                        'Buy Now'
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default StickerCard;
