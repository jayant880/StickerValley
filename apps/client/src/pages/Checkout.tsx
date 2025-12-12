import { orderService } from "@/service/orderService";
import { RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import type { Order, OrderItem, Sticker } from "@sticker-valley/shared-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Calendar, CreditCard } from "lucide-react";

interface OrderWithItems extends Order {
    items: (OrderItem & {
        sticker: Sticker;
    })[];
}

const Checkout = () => {
    const { orderId } = useParams();
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const [order, setOrder] = useState<OrderWithItems | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!isLoaded || !isSignedIn) return;
            try {
                await getToken();
                const res = await orderService.getOrderById({ orderId: orderId! });
                setOrder(res.order);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, isLoaded, isSignedIn, getToken]);

    if (!isLoaded || loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isSignedIn) return <RedirectToSignIn />;

    if (!order) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-center">
                <Package className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Order not found</h2>
                <p className="text-muted-foreground">The order you are looking for does not exist.</p>
            </div>
        );
    }

    const formatCurrency = (amount: number | string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Number(amount));
    };

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="mb-8 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
                    <Badge variant={order.status === 'PENDING' ? 'secondary' : 'default'} className="text-sm">
                        {order.status}
                    </Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ordered on {formatDate(order.createdAt)}
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                            <CardDescription>Order ID: {order.id}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-start gap-4">
                                    <div className="relative aspect-square h-24 w-24 min-w-24 overflow-hidden rounded-lg border bg-muted">
                                        {item.sticker.images?.[0] ? (
                                            <img
                                                src={item.sticker.images[0]}
                                                alt={item.sticker.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                                <Package className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col gap-1">
                                        <div className="flex justify-between gap-2">
                                            <h3 className="font-semibold">{item.sticker.name}</h3>
                                            <p className="font-medium">
                                                {formatCurrency(Number(item.price) * item.quantity)}
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {item.sticker.description}
                                        </p>
                                        <div className="mt-auto flex items-center text-sm text-muted-foreground">
                                            Qty: {item.quantity} X {formatCurrency(item.price)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-muted-foreground">Calculated at payment</span>
                            </div>
                            <div className="my-4 h-px bg-border" />
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Proceed to Payment
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Checkout;

