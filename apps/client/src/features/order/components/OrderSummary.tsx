import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import useOrder from '../hooks/useOrder';

interface OrderSummaryProps {
    totalAmount: number;
    cartId: string;
}

export const OrderSummary = ({ totalAmount, cartId }: OrderSummaryProps) => {
    const navigate = useNavigate();
    const { createOrder, isCreating } = useOrder();

    const handleCheckout = () => {
        createOrder(
            { cartId },
            {
                onSuccess: (data) => {
                    if (data && data.id) {
                        setTimeout(() => {
                            navigate(`/checkout/${data.id}`);
                        }, 1000);
                    } else {
                        toast.error('Failed to create order');
                    }
                },
                onError: () => {
                    toast.error('An error occurred');
                },
            },
        );
    };
    return (
        <Card className="border-primary/10 sticky top-24 border-2 shadow-lg">
            <div className="space-y-6 p-6">
                <h2 className="text-xl font-semibold">Order Summary</h2>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${Number(totalAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">$0.00</span>
                    </div>
                    <div className="border-border flex items-end justify-between border-t pt-3">
                        <span className="text-base font-semibold">Total</span>
                        <span className="text-primary text-2xl font-bold">
                            ${Number(totalAmount).toFixed(2)}
                        </span>
                    </div>
                </div>

                <CardFooter className="p-0 pt-2">
                    <Button
                        className="h-12 w-full text-base font-semibold shadow-md transition-transform active:scale-95"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        {isCreating ? 'Creating Order...' : 'Checkout Now'}
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );
};
