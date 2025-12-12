import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { stickerService } from "@/service/stickerService";
import type { Sticker, Shop } from "@sticker-valley/shared-types";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { CartService } from "@/service/cartService";

type StickerWithShop = Sticker & { shop: Shop };

const StickerDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const [sticker, setSticker] = useState<StickerWithShop | null>(null);
    const [loading, setLoading] = useState(true);


    const handleCart = async () => {
        if (!isSignedIn) {
            toast.error("Please sign in to add to cart");
            return;
        }
        if (!sticker?.id) return;

        try {
            await CartService.addToCart({ stickerId: sticker.id });
            toast.success("Added to cart");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add to cart");
        }
    }

    const handleBuyNow = async () => {
        if (!isSignedIn) {
            toast.error("Please sign in to buy");
            return;
        }
        if (!sticker?.id) return;

        try {
            await CartService.addToCart({ stickerId: sticker.id });
            navigate('/cart');
        } catch (error) {
            console.error(error);
            toast.error("Failed to process");
        }
    }

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        const fetchSticker = async () => {
            setLoading(true);
            try {
                const data = await stickerService.getStickerById(id);
                setSticker(data);

            } catch (error) {
                console.error(error);
                toast.error("Failed to load sticker details");
                setSticker(null);
            } finally {
                setLoading(false);
            }
        }
        fetchSticker();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center flex-col">
                <span className="text-center text-5xl font-bold mt-12 bg-linear-to-r from-gray-500 to-purple-500 bg-clip-text text-transparent p-4 rounded-lg animate-bounce">
                    Loading
                </span>
                <Spinner className="mr-2 w-8 h-8 text-primary" />
            </div>
        );
    }

    if (!sticker) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-center">Sticker not found</h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
                <aside className="w-1/3 mr-10">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {sticker.images?.map((image) => (
                                <CarouselItem key={image} className="w-full flex justify-center">
                                    <img src={image} alt={sticker.name} className="object-cover" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </aside>
                <main className="flex-1 p-4 border-l-2 border-primary pl-8 ml-5 space-y-4">
                    <h1 className="text-3xl font-bold">{sticker.name}</h1>
                    <p className="text-muted-foreground">{sticker.description}</p>
                    <p className="text-muted-foreground font-bold text-xl">${sticker.price}</p>
                    <Badge className="text-primary bg-secondary ">{sticker.type}</Badge>
                    {sticker.type === "PHYSICAL" && (
                        <p className="text-muted-foreground font-bold text-xl">Only <span className="text-primary">{sticker.stock}</span> left</p>
                    )}
                    {sticker.shop && (
                        <>
                            <p className="text-muted-foreground font-bold text-xl">{sticker.shop.name}</p> {/* TODO: Add shop link */}
                            <p className="text-muted-foreground font-bold text-xl">{sticker.shop.description}</p>
                        </>
                    )}
                    <p className="text-muted-foreground">{new Date(sticker.createdAt).toLocaleDateString()}</p>
                    <div className="flex gap-4">
                        <Button className="bg-primary text-primary-foreground" onClick={handleCart}>Add to Cart</Button>
                        <Button className="bg-primary text-primary-foreground" variant="outline" onClick={handleBuyNow}>Buy Now</Button>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default StickerDetail