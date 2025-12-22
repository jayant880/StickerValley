import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Package, Download, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import useOrder from '@/features/order/hooks/useOrder';
import { downloadFile } from '@/lib/utils';
import { toast } from 'sonner';
import { SimulatedTracking } from '@/features/order/components/SimulatedTracking';

const PaymentSuccess = () => {
    const { orderId } = useParams();
    const { user } = useUser();
    const { useOrderByIdQuery } = useOrder();
    const { data: order, isLoading, isError } = useOrderByIdQuery(orderId);
    const downloadedRef = useRef(false);

    const handleDownloadDigitalItems = () => {
        if (!order) return;
        const digitalItems = order.items?.filter((item) => item.sticker?.type === 'DIGITAL') || [];

        if (digitalItems.length > 0) {
            toast.info(`Starting download for ${digitalItems.length} digital sticker(s)...`, {
                duration: 5000,
            });

            digitalItems.forEach((item) => {
                item.sticker?.images?.forEach((image, index) => {
                    const fileName = `${item.sticker!.name.replace(/\s+/g, '_')}_${index + 1}.png`;
                    downloadFile(image, fileName);
                });
            });

            toast.success('Downloads started! Please check your downloads folder.', {
                duration: 5000,
            });
        }
    };

    useEffect(() => {
        if (order && order.status === 'PAID' && !downloadedRef.current) {
            handleDownloadDigitalItems();
            if (order.items?.some((item) => item.sticker?.type === 'DIGITAL')) {
                downloadedRef.current = true;
            }
        }
    }, [order]);

    if (isLoading) {
        return (
            <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
                <Loader2 className="text-primary h-10 w-10 animate-spin" />
                <p className="text-muted-foreground animate-pulse font-medium">
                    Verifying your payment...
                </p>
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 flex h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center duration-700">
                <div className="bg-destructive/10 rounded-full p-4">
                    <Package className="text-destructive h-12 w-12" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Order Not Found</h2>
                    <p className="text-muted-foreground max-w-sm">
                        We couldn&apos;t find the details for this order. It may still be processing
                        or the ID is incorrect.
                    </p>
                </div>
                <Link to="/stickers">
                    <Button variant="outline">Browse Stickers</Button>
                </Link>
            </div>
        );
    }

    const hasDigitalItems = order.items?.some((item) => item.sticker?.type === 'DIGITAL');

    return (
        <>
            <title>Sticker Valley | Payment Success</title>
            <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 text-center duration-700">
                <div className="bg-primary/10 mb-8 rounded-full p-6">
                    <CheckCircle2 className="text-primary h-20 w-20" />
                </div>

                <div className="mb-10 space-y-3">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Demo Payment Successful!
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl">
                        Thank you for your demo purchase. Your order{' '}
                        <span className="text-foreground font-mono font-bold">
                            #{orderId?.slice(-8).toUpperCase()}
                        </span>{' '}
                        is now visible in your dashboard.
                    </p>
                </div>

                <div className="mb-10 flex w-full max-w-5xl flex-wrap justify-center gap-6">
                    {hasDigitalItems && (
                        <div className="bg-primary/5 border-primary/10 hover:bg-primary/[0.07] flex max-w-md flex-1 items-center gap-4 rounded-3xl border p-8 text-left transition-all">
                            <div className="bg-primary/20 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
                                <Download className="text-primary h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Digital Download Started</h3>
                                <p className="text-muted-foreground text-sm">
                                    Your digital stickers are being downloaded to your device
                                    automatically.
                                </p>
                                <button
                                    onClick={handleDownloadDigitalItems}
                                    className="text-primary mt-3 flex items-center gap-1 text-sm font-bold hover:underline"
                                >
                                    Not downloading? Click here
                                    <ArrowRight className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    )}

                    {order.items?.some((item) => item.sticker?.type === 'PHYSICAL') && (
                        <div className="w-full max-w-md flex-1">
                            <SimulatedTracking createdAt={order.createdAt} orderId={order.id} />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <Link to={`/profile/${user?.id}`}>
                        <Button variant="outline" size="lg" className="h-14 px-8 font-semibold">
                            View My Orders
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link to="/stickers">
                        <Button size="lg" className="bg-primary h-14 px-10 font-semibold shadow-lg">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>

                <div className="text-muted-foreground mt-12 text-sm italic">
                    <p>This is a demo application. No real products will be shipped.</p>
                </div>
            </div>
        </>
    );
};

export default PaymentSuccess;
