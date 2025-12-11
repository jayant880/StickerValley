import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";

export const CartEmptyState = () => {
    return (
        <div className="container mx-auto px-4 py-20 max-w-6xl">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <ShoppingCart className="w-6 h-6" />
                    </EmptyMedia>
                    <EmptyTitle>Your cart is empty</EmptyTitle>
                    <EmptyDescription>
                        Looks like you haven't added any stickers yet.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button asChild>
                        <Link to="/stickers">Browse Stickers</Link>
                    </Button>
                </EmptyContent>
            </Empty>
        </div>
    );
};
