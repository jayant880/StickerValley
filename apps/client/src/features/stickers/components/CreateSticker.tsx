import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from '@/components/ui/select';
import { useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { DollarSign, Package, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useStickerStore } from '../store/stickersStore';
import useStickers from '../hooks/useStickers';
import useShop from '@/features/shop/hooks/useShop';
import { useMeQuery } from '@/features/auth/hooks/useUser';

const CreateSticker = () => {
    const navigate = useNavigate();
    const { stickerForm, stickerFormActions } = useStickerStore();
    const { useCreateSticker } = useStickers();

    const createStickerMutation = useCreateSticker();
    const { data, isSuccess, isPending, isError, error } = createStickerMutation;

    const { name, description, price, type, stock, images } = stickerForm;
    const { setName, setDescription, setPrice, setType, setStock, setImages, resetStickerForm } =
        stickerFormActions;

    const { myShop } = useShop();
    const { data: user, isLoading: isUserLoading } = useMeQuery();

    useEffect(() => {
        const checkPermission = async () => {
            if (isUserLoading) return;

            if (!user) return;

            if (myShop && user && myShop.userId !== user.id) {
                toast.error('You are not authorized to create a sticker');
                setTimeout(() => {
                    toast.dismiss();
                    toast.warning('Redirecting to home page');
                    navigate('/');
                }, 2000);
            }
        };
        checkPermission();
    }, [user, myShop, navigate, isUserLoading]);

    useEffect(() => {
        if (isSuccess && data) {
            const createdSticker = data;
            toast.success('Sticker created successfully');

            const timer = setTimeout(() => {
                navigate(`/stickers/${createdSticker.id}`);
                resetStickerForm();
            }, 1000);

            return () => {
                toast.dismiss();
                clearTimeout(timer);
            };
        }
    }, [isSuccess, data, navigate, resetStickerForm]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const filteredImages = images.filter((url) => url.trim() !== '');
        if (filteredImages.length === 0) {
            toast.error('At least one valid image URL is required');
            return;
        }

        setImages(filteredImages);
        createStickerMutation.mutate();
    };

    if (isPending && !isPending) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Spinner className="h-8 w-8" />
                <span className="ml-2">Verifying permission...</span>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto max-w-2xl py-10 duration-700">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create New Sticker</CardTitle>
                    <CardDescription>
                        Fill in the details to add a new sticker to your shop.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Sticker Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. Grumpy Cat"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe your sticker..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <div className="relative">
                                    <DollarSign className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                                    <Input
                                        id="price"
                                        type="number"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        className="pl-9"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select onValueChange={setType} defaultValue={type}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DIGITAL">Digital Download</SelectItem>
                                        <SelectItem value="PHYSICAL">Physical Product</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {stickerForm.type === 'PHYSICAL' && (
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <div className="relative">
                                    <Package className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                                    <Input
                                        id="stock"
                                        type="number"
                                        name="stock"
                                        min="0"
                                        className="pl-9"
                                        value={stock}
                                        onChange={(e) => setStock(Number(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <Label>Images</Label>
                            {images.map((url, index) => (
                                <div key={index} className="relative flex gap-2">
                                    <div className="relative flex-1">
                                        <ImageIcon className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                                        <Input
                                            type="url"
                                            placeholder="https://example.com/sticker.png"
                                            className="pl-9"
                                            value={url}
                                            onChange={(e) => {
                                                const newImages = [...images];
                                                newImages[index] = e.target.value;
                                                setImages(newImages);
                                            }}
                                            required
                                        />
                                    </div>
                                    {images.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => {
                                                const newImages = [...images];
                                                newImages.splice(index, 1);
                                                setImages(newImages);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed"
                                onClick={() => setImages([...images, ''])}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Another Image
                            </Button>
                            <p className="text-muted-foreground text-xs">
                                Add direct links to your sticker images. The first image will be
                                used as the main thumbnail.
                            </p>
                        </div>

                        {isError && (
                            <div className="rounded-md border border-red-200 bg-red-50 p-3">
                                <p className="text-sm text-red-600">
                                    Error: {error?.message || 'Failed to create sticker'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" /> Creating...
                                </>
                            ) : (
                                'Create Sticker'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default CreateSticker;
