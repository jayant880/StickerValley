import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { CartService } from "@/service/cartService";
import { Link2 } from "lucide-react";
import useStickers from "../hooks/useStickers";

const StickerDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { useStickerQuery } = useStickers();
    const { data: sticker, isLoading, isError, error } = useStickerQuery(id);
    const { isSignedIn } = useAuth();


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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center flex-col">
                <Spinner className="mr-2 w-8 h-8 text-primary" />
                <span className="text-center text-5xl font-bold mt-12 bg-linear-to-r from-gray-500 to-purple-500 bg-clip-text text-transparent p-4 rounded-lg animate-bounce">
                    Loading...
                </span>
            </div>
        );
    }

    if (isError || !sticker) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-center">
                    {error?.message || "Sticker not found"}
                </h1>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex gap-8">
                <aside className="w-1/3 mr-10">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {sticker.images?.map((image: string) => (
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
                    <p className="text-muted-foreground font-bold text-xl">${Number(sticker.price).toFixed(2)}</p>
                    <Badge className="text-primary bg-secondary ">{sticker.type}</Badge>
                    {sticker.type === "PHYSICAL" && sticker.stock && (
                        <p className="text-muted-foreground font-bold text-xl">{sticker.stock > 0 ? ("Only" + " " + <span className="text-primary">{sticker.stock}</span> + "left") : "Out of Stock"}</p>
                    )}
                    {sticker.shop && (
                        <>
                            <Link to={`/shop/${sticker.shop.id}`} className="flex items-center"><Link2 className="mr-2" /><p className="text-muted-foreground font-bold text-xl">{sticker.shop.name}</p></Link>
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