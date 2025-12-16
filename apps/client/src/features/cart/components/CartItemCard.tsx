import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router";
import useCart from "../hooks/useCart";
import { toast } from "sonner";
import type { CartItemWithStickers } from "../types/cart.types";

export const CartItemCard = ({ item }: { item: CartItemWithStickers }) => {
    const { updateCartItem, removeCartItem, isUpdating, isRemoving } = useCart();

    const imageSrc = item.sticker.images && item.sticker.images.length > 0
        ? item.sticker.images[0]
        : "/placeholder.png";

    const handleQuantityChange = (quantity: number) => {
        updateCartItem({ stickerId: item.stickerId, quantity }, {
            onSuccess: () => toast.success("Cart updated"),
            onError: (error: Error) => toast.error(`Failed to update: ${error.message}`)
        });
    }

    const handleRemove = () => {
        removeCartItem({ stickerId: item.stickerId }, {
            onSuccess: () => toast.success("Item removed"),
            onError: (error: Error) => toast.error(`Failed to remove: ${error.message}`)
        });
    }

    return (
        <Card className="overflow-hidden">
            <div className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                <div className="shrink-0">
                    <img
                        src={imageSrc}
                        alt={item.sticker.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg bg-muted"
                    />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <h3 className="font-semibold text-lg hover:underline decoration-primary/50 cursor-pointer line-clamp-1">
                                <Link to={`/stickers/${item.sticker.id}`}>
                                    {item.sticker.name}
                                </Link>
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {item.sticker.description}
                            </p>
                        </div>
                        <p className="font-bold text-lg">
                            ${Number(item.sticker.price).toFixed(2)}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-lg bg-background shadow-sm">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-r-none hover:bg-muted/50 disabled:opacity-50"
                                disabled={item.quantity <= 1 || isUpdating}
                                onClick={() => handleQuantityChange(item.quantity - 1)}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm font-medium tabular-nums">
                                {isUpdating ? "..." : item.quantity}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-l-none hover:bg-muted/50 disabled:opacity-50"
                                onClick={() => handleQuantityChange(item.quantity + 1)}
                                disabled={
                                    item.quantity >= (item.sticker.stock || 99) ||
                                    isUpdating
                                }
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
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span className="sr-only sm:not-sr-only">
                                {isRemoving ? "Removing..." : "Remove"}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};