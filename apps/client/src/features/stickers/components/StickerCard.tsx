import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CartService } from '@/service/cartService';
import { useAuth } from '@clerk/clerk-react';
import type { Sticker } from '@sticker-valley/shared-types';
import { ShoppingCart, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

const StickerCard = ({ sticker }: { sticker: Partial<Sticker> }) => {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    const imageSrc = (sticker.images && sticker.images.length > 0)
        ? sticker.images[0]
        : 'https://placehold.co/400x400/png?text=' + (sticker.name || 'Sticker');

    const handleCart = async () => {
        if (!isSignedIn) {
            toast.error("Please sign in to add to cart");
            return;
        }
        if (!sticker.id) return;

        try {
            await CartService.addToCart({ stickerId: sticker.id });
            toast.success("Added to cart");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add to cart");
        }
    }

    const handleBuyNow = async () => {
        if (!isSignedIn) {
            toast.error("Please sign in to buy");
            return;
        }
        if (!sticker.id) return;

        try {
            await CartService.addToCart({ stickerId: sticker.id });
            navigate('/cart');
        } catch (error) {
            console.error(error);
            toast.error("Failed to process");
        }
    }

    return (
        <Card className='group h-full flex flex-col overflow-hidden border-border/50 bg-card hover:bg-card/80 transition-all duration-300 min-w-64'>
            <CardHeader className='p-0'>
                <div className='relative w-full pt-[100%] overflow-hidden bg-muted/20'>
                    <img
                        src={imageSrc}
                        alt={sticker.name || 'Sticker'}
                        className='absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110'
                    />
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
                <Button variant="outline" size="sm" className='w-full' onClick={handleCart}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                </Button>
                <Button size="sm" className='w-full' onClick={handleBuyNow}>
                    <Zap className="w-4 h-4 mr-2" />
                    Buy Now
                </Button>
            </CardFooter>
        </Card>
    );
};

export default StickerCard;