import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { CartEmptyState } from "@/components/cart/CartEmptyState";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { CartSkeleton } from "@/components/cart/CartSkeleton";
import { OrderSummary } from "@/components/cart/OrderSummary";
import type { CartItemWithStickers } from "@/components/cart/types";
import { CartService } from "@/service/cartService";
import { useUser } from "@clerk/clerk-react";
import type { Cart } from "@sticker-valley/shared-types";
import { Loader2, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CartWithCartItems extends Cart {
    items: CartItemWithStickers[];
    totalItems: number;
    totalAmount: number;
}

const Cart = () => {
    const [cart, setCart] = useState<CartWithCartItems>();
    const [isLoading, setIsLoading] = useState(true);
    const { user, isLoaded: isUserLoaded } = useUser();

    useEffect(() => {
        const fetchCart = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const cartData = await CartService.getCart();
                setCart(cartData.data);
                toast.success("Cart fetched successfully");
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch cart");
            } finally {
                setIsLoading(false);
            }
        }
        if (isUserLoaded) {
            fetchCart();
        }
    }, [user, isUserLoaded]);

    const handleClearCart = async () => {
        try {
            await CartService.clearCart();
            setCart(undefined);
            toast.success("Cart cleared");
        } catch (error) {
            console.error(error);
            toast.error("Failed to clear cart");
        }
    }

    const handleQuantityChange = async (stickerId: string, quantity: number) => {
        setCart(prev => {
            if (!prev) return prev;
            const updatedItems = prev.items.map(item =>
                item.stickerId === stickerId ? { ...item, quantity } : item
            );
            return { ...prev, items: updatedItems };
        });

        try {
            await CartService.updateCartItem({ stickerId, quantity });
            const updatedCart = await CartService.getCart();
            setCart(updatedCart.data);
            toast.success("Cart updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update cart");
            const cartData = await CartService.getCart();
            setCart(cartData.data);
        }
    }

    const handleRemoveCartItem = async (stickerId: string) => {
        try {
            await CartService.removeCartItem({ stickerId });
            const updatedCart = await CartService.getCart();
            setCart(updatedCart.data);
            toast.success("Item removed successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove item");
        }
    }

    if (!isUserLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ShoppingCart className="w-6 h-6" />
                        </EmptyMedia>
                        <EmptyTitle>Sign in to view your cart</EmptyTitle>
                        <EmptyDescription>
                            You need to be logged in to manage your shopping cart.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button onClick={() => window.location.href = "/"} className="w-full">
                            Sign In
                        </Button>
                    </EmptyContent>
                </Empty>
            </div>
        )
    }

    if (isLoading) {
        return <CartSkeleton />
    }

    if (!cart?.items || cart.items.length === 0) {
        return <CartEmptyState />
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Shopping Cart ({cart.totalItems})</h1>
                <Button variant="destructive" onClick={handleClearCart}>Clear Cart</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-1 lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <CartItemCard
                            key={item.id}
                            item={item}
                            onQuantityChange={handleQuantityChange}
                            onRemove={handleRemoveCartItem}
                        />
                    ))}
                </div>

                <div className="col-span-1">
                    <OrderSummary
                        totalAmount={cart.totalAmount}
                    />

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-center text-muted-foreground">
                        <p>Secure Checkout powered by Stripe</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart;