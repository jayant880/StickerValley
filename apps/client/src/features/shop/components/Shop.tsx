import { useUser } from '@clerk/clerk-react';
import { useNavigate, useParams } from 'react-router';
import type { Shop as ShopType, Sticker } from '@sticker-valley/shared-types';
import StickerCard from '@/features/stickers/components/StickerCard';
import { Button } from '@/components/ui/button';
import { Plus, Store, Package, Layers, Edit, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import useShop, { useUpdateShopMutation } from '../hooks/useShop';
import { useMeQuery } from '@/features/auth/hooks/useUser';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useShopStore } from '../store/shopStore';
import { toast } from 'sonner';

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
    const { shopForm, shopFormActions, clearShopForm } = useShopStore();
    const updateShopMutation = useUpdateShopMutation();
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

    const currentShop = shop || myShopData;
    const isLoading = shopLoading || myShopLoading || isUserLoading;
    const isMyShopView = !shopId;

    const handleStartEditing = () => {
        if (!currentShop) return;
        shopFormActions.setName(currentShop.name);
        shopFormActions.setDescription(currentShop.description || '');
        setErrors({});
        setIsEditing(true);
    };

    const validate = () => {
        const newErrors: { name?: string; description?: string } = {};

        if (!shopForm.name.trim()) {
            newErrors.name = 'Shop name is required';
        } else if (shopForm.name.trim().length < 3) {
            newErrors.name = 'Shop name must be at least 3 characters long';
        }

        if (!shopForm.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (shopForm.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = () => {
        if (!user || !myShopData?.id) return;

        if (!validate()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        updateShopMutation.mutate(undefined, {
            onSuccess: () => {
                setIsEditing(false);
                toast.success('Shop updated successfully');
                clearShopForm();
            },
            onError: (error) => {
                console.error('Update error:', error);
                toast.error('Failed to update shop');
            },
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setErrors({});
        clearShopForm();
    };

    if (!isLoaded || isLoading) {
        return (
            <div className="container mx-auto space-y-8 px-4 py-8">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-6 w-2/3" />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-[350px] rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (isMyShopView && (!currentUser || currentUser.role !== 'VENDOR')) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
                <Card className="w-full max-w-md border-2 border-dashed p-8 text-center">
                    <div className="bg-primary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                        <Store className="text-primary h-8 w-8" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold">Start Selling Today</h2>
                    <p className="text-muted-foreground mb-6">
                        You don't have a shop yet. Create one to start selling your unique stickers
                        to the world!
                    </p>
                    <Button onClick={() => navigate('/shop/create')} size="lg" className="w-full">
                        Create My Shop
                    </Button>
                </Card>
            </div>
        );
    }

    if (!currentShop) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
                <div className="space-y-4 text-center">
                    <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                        <Layers className="text-muted-foreground h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Shop Not Found</h1>
                    <p className="text-muted-foreground">
                        We couldn't locate your shop information.
                    </p>
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
        <>
            <title>Sticker Valley | Shop </title>
            <div className="bg-background animate-in fade-in slide-in-from-bottom-4 min-h-screen pb-20 duration-700">
                {/* Header Section */}
                <div className="bg-muted/30 relative border-b">
                    <div className="container mx-auto px-4 py-12 md:py-16">
                        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                            <div className="max-w-2xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="h-6">
                                        <Store className="mr-1 h-3 w-3" />
                                        Vendor
                                    </Badge>
                                    {user?.id === currentShop.userId && (
                                        <Badge
                                            variant="outline"
                                            className="border-primary/20 text-primary h-6"
                                        >
                                            Owner View
                                        </Badge>
                                    )}
                                </div>
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <Input
                                                value={shopForm.name}
                                                onChange={(e) => {
                                                    shopFormActions.setName(e.target.value);
                                                    if (errors.name)
                                                        setErrors((prev) => ({
                                                            ...prev,
                                                            name: undefined,
                                                        }));
                                                }}
                                                placeholder="Shop Name"
                                                className={`h-12 text-2xl font-bold ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            {errors.name && (
                                                <div className="text-destructive flex items-center gap-1 text-xs">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <Input
                                                value={shopForm.description}
                                                onChange={(e) => {
                                                    shopFormActions.setDescription(e.target.value);
                                                    if (errors.description)
                                                        setErrors((prev) => ({
                                                            ...prev,
                                                            description: undefined,
                                                        }));
                                                }}
                                                placeholder="Shop Description"
                                                className={`text-lg ${errors.description ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            {errors.description && (
                                                <div className="text-destructive flex items-center gap-1 text-xs">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.description}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleUpdate}
                                                disabled={updateShopMutation.isPending}
                                            >
                                                {updateShopMutation.isPending
                                                    ? 'Saving...'
                                                    : 'Save Changes'}
                                            </Button>
                                            <Button variant="outline" onClick={handleCancel}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl lg:text-6xl">
                                            {currentShop.name}
                                        </h1>
                                        <p className="text-muted-foreground text-lg leading-relaxed">
                                            {currentShop.description}
                                        </p>
                                    </>
                                )}
                            </div>

                            {user?.id === currentShop.userId && !isEditing && (
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleStartEditing}
                                        className="hover:shadow-primary/25 shadow-lg transition-all"
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Shop
                                    </Button>
                                    {stickers.length > 0 && (
                                        <Button
                                            onClick={() =>
                                                navigate(`/shop/${currentShop.id}/stickers/create`)
                                            }
                                            className="hover:shadow-primary/25 shadow-lg transition-all"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create New Sticker
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="container mx-auto px-4 py-12">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-2xl font-bold">
                            <Package className="text-primary h-5 w-5" />
                            All Products
                            <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary hover:bg-primary/20 ml-2"
                            >
                                {stickers.length}
                            </Badge>
                        </h2>
                    </div>

                    {stickers.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {stickers.map((sticker) => (
                                <StickerCard key={sticker.id} sticker={sticker} />
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-muted/5 border-2 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                                    <Package className="text-muted-foreground h-6 w-6" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">No stickers yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    Your shop is looking a bit empty. Create your first sticker to
                                    start selling!
                                </p>
                                {user?.id === currentShop.userId && (
                                    <Button
                                        onClick={() =>
                                            navigate(`/shop/${currentShop.id}/stickers/create`)
                                        }
                                        variant="secondary"
                                    >
                                        Create Your First Sticker
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
};

export default Shop;
