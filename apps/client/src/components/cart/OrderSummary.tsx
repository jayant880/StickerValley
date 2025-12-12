import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { orderService } from "@/service/orderService";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface OrderSummaryProps {
    totalAmount: number;
    cartId: string;
}

export const OrderSummary = ({ totalAmount, cartId }: OrderSummaryProps) => {
    const navigate = useNavigate();

    const handleCheckout = async () => {
        try {
            const res = await orderService.createOrder({ cartId });
            if (res && res.order) {
                navigate(`/checkout/${res.order.id}`);
            } else {
                toast.error("Failed to create order");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    }
    return (
        <Card className="sticky top-24 shadow-lg border-2 border-primary/10">
            <div className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Order Summary</h2>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${Number(totalAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">$0.00</span>
                    </div>
                    <div className="pt-3 border-t border-border flex justify-between items-end">
                        <span className="text-base font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                            ${Number(totalAmount).toFixed(2)}
                        </span>
                    </div>
                </div>

                <CardFooter className="p-0 pt-2">
                    <Button className="w-full h-12 text-base font-semibold shadow-md active:scale-95 transition-transform" size="lg" onClick={handleCheckout}>
                        Checkout Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </div>
        </Card>
    );
};
