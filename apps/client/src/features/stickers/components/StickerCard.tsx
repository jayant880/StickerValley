import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import useCart from '@/features/cart/hooks/useCart';
import { useAuth } from '@clerk/clerk-react';
import type { Sticker } from '@sticker-valley/shared-types';
import { ShoppingCart, Zap, Check, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useMemo } from 'react';

const StickerCard = ({ sticker }: { sticker: Partial<Sticker> }) => {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();
    const { cart, addToCart, removeCartItem, isAdding, isRemoving } = useCart();

    const isInCart = useMemo(() => {
        return cart?.items?.some(item => item.stickerId === sticker.id) || false;
    }, [cart, sticker.id]);

    const imageSrc = (sticker.images && sticker.images.length > 0)
        ? sticker.images[0]
        : 'https://placehold.co/400x400/png?text=' + (sticker.name || 'Sticker');

    const handleCartToggle = async () => {
        if (!isSignedIn) {
            toast.error("Please sign in to manage your cart");
            return;
        }
        if (!sticker.id) return;

        if (isInCart) {
            removeCartItem({ stickerId: sticker.id }, {
                onSuccess: () => {
                    toast.success("Removed from cart");
                },
                onError: () => {
                    toast.error("Failed to remove from cart");
                }
            });
        } else {
            addToCart({ stickerId: sticker.id }, {
                onSuccess: () => {
                    toast.success("Added to cart", {
                        action: {
                            label: "View Cart",
                            onClick: () => navigate("/cart")
                        }
                    });
                },
                onError: () => {
                    toast.error("Failed to add to cart");
                }
            });
        }
    }

    const handleBuyNow = async () => {
        if (!isSignedIn) {
            toast.error("Please sign in to buy");
            return;
        }
        if (!sticker.id) return;

        if (isInCart) {
            navigate('/cart');
            return;
        }

        addToCart({ stickerId: sticker.id }, {
            onSuccess: () => {
                toast.success("Added to cart");
                navigate('/cart');
            },
            onError: () => {
                toast.error("Failed to buy");
            }
        })
    }

    const isLoading = isAdding || isRemoving;

    return (
        <Card className='group h-full flex flex-col overflow-hidden border-border/50 bg-card hover:bg-card/80 transition-all duration-300 min-w-64'>
            <CardHeader className='p-0'>
                <div className='relative w-full pt-[100%] overflow-hidden bg-muted/20'>
                    <img
                        src={imageSrc}
                        alt={sticker.name || 'Sticker'}
                        className='absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110'
                    />
                    {sticker.type === 'PHYSICAL' && sticker.stock === 0 && (
                        <div className="absolute top-2 right-2">
                            <Badge variant="destructive" className="shadow-sm">Out of Stock</Badge>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className='flex-1 p-4 space-y-3'>
                <div className='space-y-1'>
                    <div className='flex justify-between items-start gap-2'>
                        <Badge variant="secondary" className='font-normal text-xs uppercase tracking-wider shrink-0'>
                            {sticker.type || 'Unknown'}
                        </Badge>
                        <span className='font-bold text-lg text-primary tabular-nums shrink-0'>
                            ${sticker.price ? Number(sticker.price).toFixed(2) : '0.00'}
                        </span>
                    </div>
                    <Link to={`/stickers/${sticker.id}`}>
                        <CardTitle className='text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors'>
                            {sticker.name || 'Untitled'}
                        </CardTitle>
                    </Link>
                    <CardDescription className='text-sm line-clamp-2 leading-relaxed'>
                        {sticker.description || 'No description available'}
                    </CardDescription>
                </div>
            </CardContent>

            <CardFooter className='p-4 pt-0 gap-2 grid grid-cols-2'>
                <Button
                    variant={isInCart ? "default" : "outline"}
                    size="sm"
                    className={`w-full transition-all duration-300 ${isInCart ? 'bg-green-600 hover:bg-red-500 text-white group/cart' : ''}`}
                    onClick={handleCartToggle}
                    disabled={isLoading || (sticker.type === 'PHYSICAL' && sticker.stock === 0)}
                >
                    {isLoading ? (
                        <Spinner className="mr-2 w-4 h-4" />
                    ) : isInCart ? (
                        <>
                            <Check className="w-4 h-4 mr-2 group-hover/cart:hidden" />
                            <Trash2 className="w-4 h-4 mr-2 hidden group-hover/cart:block" />
                        </>
                    ) : (
                        <ShoppingCart className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? "Wait..." : isInCart ? "Added" : "Cart"}
                </Button>
                <Button
                    size="sm"
                    className='w-full'
                    onClick={handleBuyNow}
                    disabled={isLoading || (sticker.type === 'PHYSICAL' && sticker.stock === 0)}
                >
                    <Zap className="w-4 h-4 mr-2" />
                    {isLoading ? <Spinner className="mr-2 w-4 h-4" /> : isInCart ? "Checkout" : "Buy Now"}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default StickerCard;