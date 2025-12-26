import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Store, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import useShop from '../hooks/useShop';
import { useShopStore } from '../store/shopStore';
import { useEffect, useState } from 'react';

const CreateShop = () => {
    const navigate = useNavigate();
    const { createShop, isCreating, createShopError } = useShop();
    const { shopFormActions, shopForm, clearShopForm } = useShopStore();
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

    const { name, description } = shopForm;
    const { setName, setDescription } = shopFormActions;

    useEffect(() => {
        return () => {
            clearShopForm();
        };
    }, [clearShopForm]);

    const validate = () => {
        const newErrors: { name?: string; description?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Shop name is required';
        } else if (name.trim().length < 3) {
            newErrors.name = 'Shop name must be at least 3 characters long';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        } else if (description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fix the errors in the form');
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
        <>
            <title>Sticker Valley | Create Shop</title>
            <div className="animate-in fade-in slide-in-from-bottom-4 flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-4 duration-700">
                <div className="animate-in fade-in zoom-in w-full max-w-md duration-500">
                    <div className="mb-8 space-y-2 text-center">
                        <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                            <Store className="text-primary h-6 w-6" />
                        </div>
                        <h1 className="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                            Sticker Valley
                        </h1>
                        <p className="text-muted-foreground">
                            Turn your creativity into a business
                        </p>
                    </div>

                    <Card className="border-border/50 bg-card/95 shadow-xl backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Sparkles className="h-5 w-5 text-yellow-500" />
                                Create your Shop
                            </CardTitle>
                            <CardDescription>
                                Give your shop a catchy name and tell the world what makes your
                                stickers special.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="group space-y-2">
                                    <Label
                                        htmlFor="shopName"
                                        className={`transition-colors ${errors.name ? 'text-destructive' : 'group-focus-within:text-primary'}`}
                                    >
                                        Shop Name
                                    </Label>
                                    <Input
                                        id="shopName"
                                        name="name"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (errors.name)
                                                setErrors((prev) => ({ ...prev, name: undefined }));
                                        }}
                                        placeholder="e.g. Kawaii Stickers Co."
                                        className={`interactive-input transition-all duration-300 focus:ring-2 ${errors.name ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                                    />
                                    {errors.name && (
                                        <div className="text-destructive animate-in fade-in slide-in-from-top-1 flex items-center gap-1 text-xs">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="group space-y-2">
                                    <Label
                                        htmlFor="shopDescription"
                                        className={`transition-colors ${errors.description ? 'text-destructive' : 'group-focus-within:text-primary'}`}
                                    >
                                        Description
                                    </Label>
                                    <Textarea
                                        id="shopDescription"
                                        name="description"
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                            if (errors.description)
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    description: undefined,
                                                }));
                                        }}
                                        placeholder="Describe your sticker style and what you offer..."
                                        className={`interactive-input min-h-[120px] resize-none transition-all duration-300 focus:ring-2 ${errors.description ? 'border-destructive focus:ring-destructive/20' : 'focus:ring-primary/20'}`}
                                    />
                                    {errors.description && (
                                        <div className="text-destructive animate-in fade-in slide-in-from-top-1 flex items-center gap-1 text-xs">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.description}
                                        </div>
                                    )}
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
        </>
    );
};

export default CreateShop;
