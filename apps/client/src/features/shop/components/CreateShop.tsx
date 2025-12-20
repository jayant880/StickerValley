import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Store, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import useShop from '../hooks/useShop';
import { useShopStore } from '../store/shopStore';
import { useEffect } from 'react';

const CreateShop = () => {
    const navigate = useNavigate();
    const { createShop, isCreating, createShopError } = useShop();
    const { shopFormActions, shopForm, clearShopForm } = useShopStore();

    const { name, description } = shopForm;
    const { setName, setDescription } = shopFormActions;

    useEffect(() => {
        return () => {
            clearShopForm();
        };
    }, [clearShopForm]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!shopForm.name.trim() || !shopForm.description.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        createShop(undefined, {
            onSuccess: () => {
                toast.success('Shop created successfully!');
                clearShopForm();
                navigate('/shop/me');
            },
            onError: (error: Error) => {
                toast.error('Failed to create shop. Please try again.');
                console.error(error);
            },
        });
    };

    useEffect(() => {
        if (createShopError) {
            toast.error('Failed to create shop. Please try again.');
        }
    }, [createShopError]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4 duration-700">
            <div className="animate-in fade-in zoom-in w-full max-w-md duration-500">
                <div className="mb-8 space-y-2 text-center">
                    <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                        <Store className="text-primary h-6 w-6" />
                    </div>
                    <h1 className="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                        Sticker Valley
                    </h1>
                    <p className="text-muted-foreground">Turn your creativity into a business</p>
                </div>

                <Card className="border-border/50 bg-card/95 shadow-xl backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            Create your Shop
                        </CardTitle>
                        <CardDescription>
                            Give your shop a catchy name and tell the world what makes your stickers
                            special.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group space-y-2">
                                <Label
                                    htmlFor="shopName"
                                    className="group-focus-within:text-primary transition-colors"
                                >
                                    Shop Name
                                </Label>
                                <Input
                                    id="shopName"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Kawaii Stickers Co."
                                    className="interactive-input focus:ring-primary/20 transition-all duration-300 focus:ring-2"
                                />
                            </div>

                            <div className="group space-y-2">
                                <Label
                                    htmlFor="shopDescription"
                                    className="group-focus-within:text-primary transition-colors"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="shopDescription"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your sticker style and what you offer..."
                                    className="interactive-input focus:ring-primary/20 min-h-[120px] resize-none transition-all duration-300 focus:ring-2"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isCreating}
                                className="h-11 w-full text-base font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                            >
                                {isCreating ? (
                                    <>
                                        <Spinner className="mr-2 h-5 w-5 animate-spin" />
                                        Creating Shop...
                                    </>
                                ) : (
                                    'Launch Shop'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-muted-foreground mt-6 text-center text-sm">
                    By creating a shop, you agree to our Terms of Service
                </p>
            </div>
        </div>
    );
};

export default CreateShop;
