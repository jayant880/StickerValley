import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';

const PaymentFailed = () => {
    return (
        <>
            <title>Sticker Valley | Payment Failed</title>
            <div className="animate-in fade-in slide-in-from-bottom-4 flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center duration-700">
                <div className="mb-8 rounded-full bg-red-50 p-6 text-red-500">
                    <XCircle className="h-20 w-20" />
                </div>

                <div className="mb-10 space-y-3">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Payment Failed
                    </h1>
                    <p className="text-muted-foreground mx-auto max-w-lg text-lg">
                        We were unable to process your payment. This could be due to insufficient
                        funds, an expired card, or a temporary issue with the payment gateway.
                    </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                        size="lg"
                        className="h-14 bg-red-600 px-8 font-semibold hover:bg-red-700"
                        onClick={() => window.history.back()}
                    >
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Try Again
                    </Button>
                    <Link to="/stickers">
                        <Button variant="outline" size="lg" className="h-14 px-8 font-semibold">
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Return to Shop
                        </Button>
                    </Link>
                </div>

                <div className="mt-12 text-sm text-gray-500 italic">
                    <p>Demo Store: No real transactions were attempted or failed.</p>
                </div>
            </div>
        </>
    );
};

export default PaymentFailed;
