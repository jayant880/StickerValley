import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { ShoppingCart, Zap, Store, Calendar, Check, Trash2 } from "lucide-react";
import useStickers from "../hooks/useStickers";
import useCart from "@/features/cart/hooks/useCart";
import ReviewList from "@/features/review/components/ReviewList";
import { useMemo } from "react";

const StickerDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { useStickerQuery } = useStickers();
    const { data: sticker, isLoading, isError, error } = useStickerQuery(id);
    const { isSignedIn } = useAuth();
    const { cart, addToCart, removeCartItem, isAdding, isRemoving } = useCart();

    const isInCart = useMemo(() => {
        return cart?.items?.some(item => item.stickerId === sticker?.id) || false;
    }, [cart, sticker?.id]);

    const handleCartToggle = async () => {
        if (!isSignedIn) {
            toast.error("Please sign in to manage your cart");
            return;
        }
        if (!sticker?.id) return;

        if (isInCart) {
            removeCartItem({ stickerId: sticker.id }, {
                onSuccess: () => {
                    toast.success("Removed from cart");
                },
                onError: () => {
                    toast.error("Failed to remove from cart");
                }
            });
        } else {
            addToCart({ stickerId: sticker.id }, {
                onSuccess: () => {
                    toast.success("Added to cart", {
                        action: {
                            label: "View Cart",
                            onClick: () => navigate("/cart")
                        }
                    });
                },
                onError: () => {
                    toast.error("Failed to add to cart");
                }
            });
        }
    }

    const handleBuyNow = async () => {
        if (!isSignedIn) {
            toast.error("Please sign in to buy");
            return;
        }
        if (!sticker?.id) return;

        if (isInCart) {
            navigate('/cart');
            return;
        }

        addToCart({ stickerId: sticker.id }, {
            onSuccess: () => {
                toast.success("Added to cart");
                navigate('/cart');
            },
            onError: () => {
                toast.error("Failed to buy");
            }
        })
    }

    const isCartLoading = isAdding || isRemoving;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Spinner className="w-12 h-12 text-indigo-600 mb-4" />
                <p className="text-xl font-medium text-gray-500 animate-pulse">Loading sticker details...</p>
            </div>
        );
    }

    if (isError || !sticker) {
        return (
            <div className="container mx-auto px-4 py-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sticker Not Found</h1>
                <p className="text-gray-500 mb-6">{error?.message || "The sticker you are looking for does not exist."}</p>
                <Button onClick={() => navigate('/stickers')} variant="outline">Browse Stickers</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-xs aspect-square flex items-center justify-center">
                        <Carousel className="w-full h-fit">
                            <CarouselContent>
                                {sticker.images?.map((image: string, index: number) => (
                                    <CarouselItem key={index} className="w-full h-full flex items-center justify-center p-4">
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <img
                                                src={image}
                                                alt={`${sticker.name} view ${index + 1}`}
                                                className="max-w-full max-h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-4" />
                            <CarouselNext className="right-4" />
                        </Carousel>
                    </div>
                </div>

                <div className="flex flex-col space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1">
                                {sticker.type}
                            </Badge>
                            {sticker.type === 'PHYSICAL' && sticker.stock === 0 && (
                                <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200">
                                    Out of Stock
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
                            {sticker.name}
                        </h1>
                        <p className="text-3xl font-bold text-indigo-600">
                            ${Number(sticker.price).toFixed(2)}
                        </p>
                    </div>

                    <div className="prose prose-gray max-w-none">
                        <p className="text-lg text-gray-600 leading-relaxed">
                            {sticker.description}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Store className="w-5 h-5 text-gray-400" />
                                <span>Shop: <Link to={`/shop/${sticker.shop?.id}`} className="font-semibold text-indigo-600 hover:underline">{sticker.shop?.name}</Link></span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <span>Released: <span className="font-medium text-gray-900">{new Date(sticker.createdAt).toLocaleDateString()}</span></span>
                            </div>
                            {sticker.type === "PHYSICAL" && (
                                <div className="flex items-center gap-2 text-gray-600 col-span-2">
                                    <div className={`w-2 h-2 rounded-full ${sticker.stock && sticker.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <span>Availability:
                                        {sticker.stock && sticker.stock > 0 ? (
                                            <span className="font-medium text-gray-900 ml-1">{sticker.stock} in stock</span>
                                        ) : (
                                            <span className="font-medium text-red-600 ml-1">Currently unavailable</span>
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                size="lg"
                                className={`flex-1 transition-all duration-300 font-semibold h-14 group/cart ${isInCart
                                    ? "bg-green-600 hover:bg-red-500 text-white border-green-600 hover:border-red-500"
                                    : "bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50"
                                    }`}
                                onClick={handleCartToggle}
                                disabled={isCartLoading || (sticker.type === 'PHYSICAL' && sticker.stock === 0)}
                            >
                                {isCartLoading ? (
                                    <Spinner className="w-5 h-5 mr-2" />
                                ) : isInCart ? (
                                    <>
                                        <Check className="w-5 h-5 mr-2 group-hover/cart:hidden" />
                                        <Trash2 className="w-5 h-5 mr-2 hidden group-hover/cart:block" />
                                    </>
                                ) : (
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                )}
                                {isCartLoading ? "Wait..." : isInCart ? "Added" : "Add to Cart"}
                            </Button>
                            <Button
                                size="lg"
                                className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 font-semibold h-14"
                                onClick={handleBuyNow}
                                disabled={isCartLoading || (sticker.type === 'PHYSICAL' && sticker.stock === 0)}
                            >
                                {isCartLoading ? <Spinner className="w-5 h-5 mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
                                {isInCart ? "Checkout Now" : "Buy Now"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-16">
                <ReviewList stickerId={sticker.id} />
            </div>
        </div>
    )
}

export default StickerDetail