import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Sticker } from '@sticker-valley/shared-types';

const StickerCard = ({ sticker }: { sticker: Partial<Sticker> }) => {
    const imageSrc = (sticker.images && sticker.images.length > 0)
        ? sticker.images[0]
        : 'https://placehold.co/400x400/png?text=' + (sticker.name || 'Sticker');

    return (
        <Card className='hover:shadow-lg max-w-sm overflow-hidden hover:scale-[1.02] transition-transform duration-300 transform'>
            <CardHeader className='bg-gray-50'>
                <div className='relative rounded-md w-full aspect-square overflow-hidden'>
                    <img
                        src={imageSrc}
                        alt={sticker.name || 'Sticker'}
                        className='w-full h-full object-contain hover:scale-105 transition-transform duration-300'
                    />
                </div>
            </CardHeader>

            <CardContent>
                <div>
                    <CardTitle className='text-lg line-clamp-1'>{sticker.name || 'Untitled'}</CardTitle>
                    <CardDescription className='text-sm line-clamp-2'>{sticker.description || 'No description available'}</CardDescription>
                </div>

                <div className='flex justify-between items-center'>
                    <Badge variant="secondary" className='px-3 py-1'>
                        {sticker.type || 'Unknown'}
                    </Badge>
                    <p className='font-bold text-green-600 text-xl'>
                        ${sticker.price ? Number(sticker.price).toFixed(2) : '0.00'}
                    </p>
                </div>
            </CardContent>

            <CardFooter className='flex gap-2 p-4 pt-0'>
                <Button
                    variant="outline"
                    size="sm"
                    className='flex-1 bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900'
                // onClick={() => onAddToCart?.(sticker)}
                >
                    Add To Cart
                </Button>
                <Button
                    size="sm"
                    className='flex-1 bg-green-500 hover:bg-green-600 text-white'
                // onClick={() => onBuyNow?.(sticker)}
                >
                    Buy Now
                </Button>
            </CardFooter>
        </Card>
    );
};

export default StickerCard;