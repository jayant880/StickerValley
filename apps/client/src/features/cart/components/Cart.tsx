import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { useUser } from '@clerk/clerk-react';
import { Loader2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import useCart from '../hooks/useCart';
import { CartSkeleton } from './CartSkeleton';
import { CartEmptyState } from './CartEmptyState';
import { CartItemCard } from './CartItemCard';
import { OrderSummary } from '@/features/order/components/OrderSummary';

const Cart = () => {
    const { cart, isLoading, isError, error, clearCart, isClearing } = useCart();

    const { user, isLoaded: isUserLoaded } = useUser();

    const handleClearCart = async () => {
        clearCart(undefined, {
            onSuccess: () => toast.success('Cart cleared successfully'),
            onError: (error: Error) => toast.error(`Failed to clear cart due to ${error?.message}`),
        });
    };

    if (!isUserLoaded) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center px-4 py-20">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <ShoppingCart className="h-6 w-6" />
                        </EmptyMedia>
                        <EmptyTitle>Sign in to view your cart</EmptyTitle>
                        <EmptyDescription>
                            You need to be logged in to manage your shopping cart.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button onClick={() => (window.location.href = '/')} className="w-full">
                            Sign In
                        </Button>
                    </EmptyContent>
                </Empty>
            </div>
        );
    }

    if (isLoading) {
        return <CartSkeleton />;
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-destructive/10 border-destructive rounded-lg border p-6 text-center">
                    <h2 className="text-destructive mb-2 text-xl font-semibold">
                        Error Loading Cart
                    </h2>
                    <p className="text-destructive">{error?.message || 'Failed to load cart'}</p>
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
        return <CartEmptyState />;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto max-w-6xl px-4 py-8 duration-700">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Shopping Cart ({cart.totalItems || 0})</h1>
                <Button variant="destructive" onClick={handleClearCart} disabled={isClearing}>
                    {isClearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Clear Cart'}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="col-span-1 space-y-4 lg:col-span-2">
                    {cart.items.map((item) => (
                        <CartItemCard key={item.id} item={item} />
                    ))}
                </div>

                <div className="col-span-1">
                    <OrderSummary totalAmount={cart.totalAmount || 0} cartId={cart.id} />

                    <div className="bg-muted/50 text-muted-foreground mt-6 rounded-lg p-4 text-center text-sm">
                        <p>Secure Checkout powered by Trisp(mock)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
