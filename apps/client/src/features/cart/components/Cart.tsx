import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useUser } from "@clerk/clerk-react";
import { Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import useCart from "../hooks/useCart";
import { CartSkeleton } from "./CartSkeleton";
import { CartEmptyState } from "./CartEmptyState";
import { CartItemCard } from "./CartItemCard";
import { OrderSummary } from "@/features/order/components/OrderSummary";

const Cart = () => {
    const {
        cart,
        isLoading,
        isError,
        error,
        clearCart,
        isClearing,
    } = useCart();

    const { user, isLoaded: isUserLoaded } = useUser();

    const handleClearCart = async () => {
        clearCart(undefined, {
            onSuccess: () => toast.success("Cart cleared successfully"),
            onError: (error: Error) => toast.error(`Failed to clear cart due to ${error?.message}`)
        })
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

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-destructive mb-2">
                        Error Loading Cart
                    </h2>
                    <p className="text-destructive">
                        {error?.message || "Failed to load cart"}
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="mt-4"
                        variant="outline"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    if (!cart?.items || cart.items.length === 0) {
        return <CartEmptyState />
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">
                    Shopping Cart ({cart.totalItems || 0})
                </h1>
                <Button
                    variant="destructive"
                    onClick={handleClearCart}
                    disabled={isClearing}
                >
                    {isClearing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Clear Cart"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-1 lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <CartItemCard
                            key={item.id}
                            item={item}
                        />
                    ))}
                </div>

                <div className="col-span-1">
                    <OrderSummary
                        totalAmount={cart.totalAmount || 0}
                        cartId={cart.id}
                    />

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-center text-muted-foreground">
                        <p>Secure Checkout powered by Trisp(mock)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart;