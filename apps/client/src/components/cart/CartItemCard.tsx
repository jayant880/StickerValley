import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router";
import type { CartItemWithStickers } from "./types";

interface CartItemCardProps {
    item: CartItemWithStickers;
    onQuantityChange: (stickerId: string, quantity: number) => void;
    onRemove: (stickerId: string) => void;
}

export const CartItemCard = ({ item, onQuantityChange, onRemove }: CartItemCardProps) => {
    return (
        <Card className="overflow-hidden">
            <div className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                <div className="shrink-0">
                    <img
                        src={item.sticker.images ? item.sticker.images[0] : "/placeholder.png"}
                        alt={item.sticker.name}
                        className="w-32 h-32 object-cover rounded-lg bg-muted"
                    />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <h3 className="font-semibold text-lg hover:underline decoration-primary/50 cursor-pointer line-clamp-1">
                                <Link to={`/stickers/${item.sticker.id}`}>{item.sticker.name}</Link>
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
                                className="h-8 w-8 rounded-r-none hover:bg-muted/50"
                                disabled={item.quantity <= 1}
                                onClick={() => onQuantityChange(item.stickerId, item.quantity - 1)}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm font-medium tabular-nums">
                                {item.quantity}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-l-none hover:bg-muted/50"
                                onClick={() => onQuantityChange(item.stickerId, item.quantity + 1)}
                                disabled={item.quantity >= item.sticker.stock}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onRemove(item.stickerId)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span className="sr-only sm:not-sr-only">Remove</span>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};
