import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import useShop from "../hooks/useShop";
import { useShopStore } from "../store/shopStore";
import { useEffect } from "react";

const CreateShop = () => {
    const navigate = useNavigate();
    const { createShop, isCreating, createShopError } = useShop();
    const { shopFormActions, shopForm, clearShopForm } = useShopStore();

    const { name, description } = shopForm;
    const { setName, setDescription } = shopFormActions;

    useEffect(() => {
        return () => {
            clearShopForm()
        }
    }, [clearShopForm])


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!shopForm.name.trim() || !shopForm.description.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        createShop(undefined, {
            onSuccess: () => {
                toast.success("Shop created successfully!");
                clearShopForm();
                navigate("/shop/me");
            },
            onError: (error: Error) => {
                toast.error("Failed to create shop. Please try again.");
                console.error(error);
            }
        });

    };

    useEffect(() => {
        if (createShopError) {
            toast.error("Failed to create shop. Please try again.");
        }
    }, [createShopError])


    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4 ">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8 space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Store className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Sticker Valley
                    </h1>
                    <p className="text-muted-foreground">
                        Turn your creativity into a business
                    </p>
                </div>

                <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            Create your Shop
                        </CardTitle>
                        <CardDescription>
                            Give your shop a catchy name and tell the world what makes your stickers special.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 group">
                                <Label htmlFor="shopName" className="group-focus-within:text-primary transition-colors">
                                    Shop Name
                                </Label>
                                <Input
                                    id="shopName"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Kawaii Stickers Co."
                                    className="interactive-input transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="shopDescription" className="group-focus-within:text-primary transition-colors">
                                    Description
                                </Label>
                                <Textarea
                                    id="shopDescription"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your sticker style and what you offer..."
                                    className="min-h-[120px] resize-none interactive-input transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isCreating}
                                className="w-full h-11 text-base font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                            >
                                {isCreating ? (
                                    <>
                                        <Spinner className="mr-2 h-5 w-5 animate-spin" />
                                        Creating Shop...
                                    </>
                                ) : (
                                    "Launch Shop"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    By creating a shop, you agree to our Terms of Service
                </p>
            </div>
        </div>
    );
}

export default CreateShop;