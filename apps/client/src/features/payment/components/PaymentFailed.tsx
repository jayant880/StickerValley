import { Link } from 'react-router';
import { Package } from 'lucide-react';

const PaymentFailed = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 flex h-[50vh] flex-col items-center justify-center gap-2 text-center duration-700">
            <Package className="text-muted-foreground h-12 w-12" />
            <h2 className="text-xl font-semibold">Payment Failed</h2>
            <p className="text-muted-foreground">
                Thank you for your payment. Your order has been placed successfully.
            </p>
            <p>
                Continue Shopping <Link to="/stickers">here</Link>
            </p>
        </div>
    );
};

export default PaymentFailed;
