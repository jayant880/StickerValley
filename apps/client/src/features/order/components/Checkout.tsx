import { RedirectToSignIn, useAuth } from "@clerk/clerk-react"
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Calendar, CreditCard, Download } from "lucide-react";
import { toast } from "sonner";
import { downloadInvoice } from "@/features/dashboard/api/invoice.api";
import useOrder from "../hooks/useOrder";
import { useEffect } from "react";

const Checkout = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { isLoaded, isSignedIn } = useAuth();
    const { useOrderByIdQuery, usePayForOrderMutation } = useOrder();

    const { data: orderById, isLoading: isLoadingOrderById, isError: isErrorOrderById } = useOrderByIdQuery(orderId);
    const { mutate: payForOrder, isPending: isPaying } = usePayForOrderMutation();

    useEffect(() => {
        if (!orderId) navigate('/cart');
    }, [orderId, navigate]);

    const handlePay = () => {
        if (!orderId) return;
        payForOrder({ orderId }, {
            onSuccess: () => {
                toast.success("Order paid successfully");
                navigate(`/payment/${orderId}/success`);
            },
            onError: (error: Error) => {
                console.error("Payment error:", error);
                toast.error("Failed to pay for order");
                navigate(`/payment/${orderId}/failed`);
            }
        });
    }

    const handleDownloadInvoice = async () => {
        if (!orderById?.id) return;
        try {
            await downloadInvoice(orderById.id);
            toast.success("Invoice downloaded successfully");
        } catch (error) {
            console.error("Failed to download invoice", error);
            toast.error("Failed to download invoice");
        }
    }

    if (!isLoaded || isLoadingOrderById) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isSignedIn) return <RedirectToSignIn />;

    if (isErrorOrderById || !orderById) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-center">
                <Package className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Error while fetching order</h2>
                <p className="text-muted-foreground">Something went wrong while fetching the order.</p>
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

    const isPending = orderById!.status === 'PENDING';
    const isPaid = orderById!.status === 'PAID';


    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
                    <Badge
                        variant={isPending ? 'secondary' : isPaid ? 'default' : 'destructive'}
                        className="text-sm"
                    >
                        {orderById.status}
                    </Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ordered on {formatDate(orderById.createdAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                    Order ID: {orderById.id}
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                            <CardDescription>Review your items before payment</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            {(orderById.items || []).map((item) => {
                                const sticker = item.sticker!;
                                return (
                                    <div key={item.id} className="flex items-start gap-4">
                                        <div className="relative aspect-square h-24 w-24 min-w-24 overflow-hidden rounded-lg border bg-muted">
                                            {sticker.images?.[0] ? (
                                                <img
                                                    src={sticker.images[0]}
                                                    alt={sticker.name}
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
                                                <h3 className="font-semibold">{sticker.name}</h3>
                                                <p className="font-medium">
                                                    {formatCurrency(Number(item.price) * item.quantity)}
                                                </p>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {sticker.description}
                                            </p>
                                            <div className="mt-auto flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>Qty: {item.quantity}</span>
                                                <span>×</span>
                                                <span>{formatCurrency(item.price)} each</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
                                <span>{formatCurrency(orderById.totalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax</span>
                                <span>$0.00</span>
                            </div>
                            <div className="my-4 h-px bg-border" />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(orderById.totalAmount)}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2">
                            {isPending ? (
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handlePay}
                                    disabled={isPaying}
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    {isPaying ? "Processing..." : "Proceed to Payment"}
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={handleDownloadInvoice}
                                        variant="outline"
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Invoice
                                    </Button>
                                    <p className="text-center text-sm text-muted-foreground mt-2">
                                        Order status: <span className="font-medium">{orderById.status}</span>
                                    </p>
                                </>
                            )}
                        </CardFooter>
                    </Card>

                    <Card className="bg-muted/50">
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-2">Payment Information</h3>
                            <p className="text-sm text-muted-foreground">
                                Payments are processed securely via Stripe. Your payment information is encrypted and never stored on our servers.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Checkout;