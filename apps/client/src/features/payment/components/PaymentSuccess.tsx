import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { Link } from "react-router";

const PaymentSuccess = () => {
    return (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-2 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Payment Successful</h2>
            <p className="text-muted-foreground">Thank you for your payment. Your order has been placed successfully.</p>
            <Link to="/stickers"><Button>Continue Shopping</Button></Link>
        </div>
    );
}

export default PaymentSuccess;
