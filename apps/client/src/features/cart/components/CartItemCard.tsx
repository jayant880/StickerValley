import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import useCart from '../hooks/useCart';
import { toast } from 'sonner';
import type { CartItemWithSticker } from '@sticker-valley/shared-types';

export const CartItemCard = ({ item }: { item: CartItemWithSticker }) => {
    const { updateCartItem, removeCartItem, isUpdating, isRemoving } = useCart();
    const sticker = item.sticker!;

    const imageSrc =
        sticker.images && sticker.images.length > 0 ? sticker.images[0] : '/placeholder.png';

    const handleQuantityChange = (quantity: number) => {
        updateCartItem(
            { stickerId: item.stickerId, quantity },
            {
                onSuccess: () => toast.success('Cart updated'),
                onError: (error: Error) => toast.error(`Failed to update: ${error.message}`),
            },
        );
    };

    const handleRemove = () => {
        removeCartItem(
            { stickerId: item.stickerId },
            {
                onSuccess: () => toast.success('Item removed'),
                onError: (error: Error) => toast.error(`Failed to remove: ${error.message}`),
            },
        );
    };

    return (
        <Card className="overflow-hidden">
            <div className="flex gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="shrink-0">
                    <img
                        src={imageSrc}
                        alt={sticker.name}
                        className="bg-muted h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"
                    />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="decoration-primary/50 line-clamp-1 cursor-pointer text-lg font-semibold hover:underline">
                                <Link to={`/stickers/${sticker.id}`}>{sticker.name}</Link>
                            </h3>
                            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                                {sticker.description}
                            </p>
                        </div>
                        <p className="text-lg font-bold">${Number(sticker.price).toFixed(2)}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="bg-background flex items-center rounded-lg border shadow-sm">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-muted/50 h-8 w-8 rounded-r-none disabled:opacity-50"
                                disabled={item.quantity <= 1 || isUpdating}
                                onClick={() => handleQuantityChange(item.quantity - 1)}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm font-medium tabular-nums">
                                {isUpdating ? '...' : item.quantity}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-muted/50 h-8 w-8 rounded-l-none disabled:opacity-50"
                                onClick={() => handleQuantityChange(item.quantity + 1)}
                                disabled={item.quantity >= (sticker.stock || 99) || isUpdating}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
                            onClick={handleRemove}
                            disabled={isRemoving}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span className="sr-only sm:not-sr-only">
                                {isRemoving ? 'Removing...' : 'Remove'}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
