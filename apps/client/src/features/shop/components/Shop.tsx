import { useUser } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router";
import type { Shop as ShopType, Sticker } from "@sticker-valley/shared-types";
import StickerCard from "@/features/stickers/components/StickerCard";
import { Button } from "@/components/ui/button";
import { Plus, Store, Package, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import useShop from "../hooks/useShop";
import { useMeQuery } from "@/features/auth/hooks/useUser";

interface ShopWithStickers extends ShopType {
    stickers: Sticker[];
}

const Shop = () => {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const { shopId } = useParams();
    const { data: currentUser, isLoading: isUserLoading } = useMeQuery();
    const { myShop: myShopData, myShopLoading, useShopByIdQuery } = useShop();
    const { data: shop, isLoading: shopLoading } = useShopByIdQuery(shopId);

    const currentShop = shop || myShopData;
    const isLoading = shopLoading || myShopLoading || isUserLoading;
    const isMyShopView = !shopId;

    if (!isLoaded || isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-6 w-2/3" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-[350px] rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (isMyShopView && (!currentUser || currentUser.role !== "VENDOR")) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 ">
                <Card className="max-w-md w-full text-center p-8 border-dashed border-2">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Store className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Start Selling Today</h2>
                    <p className="text-muted-foreground mb-6">
                        You don't have a shop yet. Create one to start selling your unique stickers to the world!
                    </p>
                    <Button onClick={() => navigate("/shop/create")} size="lg" className="w-full">
                        Create My Shop
                    </Button>
                </Card>
            </div>
        );
    }

    if (!currentShop) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Layers className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold">Shop Not Found</h1>
                    <p className="text-muted-foreground">We couldn't locate your shop information.</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Refresh Page
                    </Button>
                </div>
            </div>
        );
    }

    const shopWithStickers = currentShop as ShopWithStickers;
    const stickers = shopWithStickers.stickers || [];

    return (
        <div className="min-h-screen bg-background pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="relative bg-muted/30 border-b">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="h-6">
                                    <Store className="w-3 h-3 mr-1" />
                                    Vendor
                                </Badge>
                                {user?.id === currentShop.userId && (
                                    <Badge variant="outline" className="h-6 border-primary/20 text-primary">
                                        Owner View
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight lg:text-6xl bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                                {currentShop.name}
                            </h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {currentShop.description}
                            </p>
                        </div>

                        {user?.id === currentShop.userId && (
                            <div className="flex gap-3">
                                <Button onClick={() => navigate(`/shop/${currentShop.id}/stickers/create`)} className="shadow-lg hover:shadow-primary/25 transition-all">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create New Sticker
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        All Products
                        <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                            {stickers.length}
                        </Badge>
                    </h2>
                </div>

                {stickers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {stickers.map((sticker) => (
                            <StickerCard key={sticker.id} sticker={sticker} />
                        ))}
                    </div>
                ) : (
                    <Card className="border-dashed border-2 bg-muted/5">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Package className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No stickers yet</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                Your shop is looking a bit empty. Create your first sticker to start selling!
                            </p>
                            {user?.id === currentShop.userId && (
                                <Button onClick={() => navigate(`/shop/${currentShop.id}/stickers/create`)} variant="secondary">
                                    Create Your First Sticker
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default Shop;
