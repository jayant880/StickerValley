import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import { stickerService } from "@/service/stickerService"
import type { Sticker } from "@sticker-valley/shared-types"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import shopService from "@/service/shopService"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { DollarSign, Package, Image as ImageIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import userService from "@/service/userService"

const CreateSticker = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);


    useEffect(() => {

        const fetchShop = async () => {
            try {
                const user = await userService.getMe();
                if (!user) {
                    toast.error("User not found");
                    setTimeout(() => {
                        toast.dismiss();
                        toast.warning("Redirecting to home page");
                        navigate('/');
                    }, 2000);
                }
                const shop = await shopService.getMyShop();
                if (!shop) {
                    navigate('/shop/create');
                }
                console.log(user, shop);
                if (shop.userId !== user.id) {
                    toast.error("You are not authorized to create a sticker");
                    setTimeout(() => {
                        toast.dismiss();
                        toast.warning("Redirecting to home page");
                        navigate('/');
                    }, 2000);
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        }
        fetchShop();
    }, [])


    const [stickerForm, setStickerForm] = useState<Partial<Sticker>>({
        name: "",
        description: "",
        price: "0",
        images: [],
        type: "DIGITAL",
        stock: 0,
        isPublished: false,
    });

    const [imageUrl, setImageUrl] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setStickerForm({
            ...stickerForm,
            [name]: name === 'stock' ? parseInt(value) || 0 : value,
        })
    }

    const handleSelectChange = (value: string) => {
        setStickerForm({
            ...stickerForm,
            type: value as Sticker['type'],
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setSubmitting(true);

            const imagesToSubmit = imageUrl ? [imageUrl] : stickerForm.images;

            const sticker = await stickerService.createSticker({
                ...stickerForm,
                images: imagesToSubmit
            });
            toast.success("Sticker created successfully");
            navigate(`/stickers/${sticker.id}`);
        } catch (error) {
            console.error(error)
            toast.error("Failed to create sticker");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Spinner className="w-8 h-8" />
            </div>
        )
    }

    return (
        <div className="container max-w-2xl py-10">
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
                                value={stickerForm.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe your sticker..."
                                value={stickerForm.description}
                                onChange={handleChange}
                                required
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="price"
                                        type="number"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        className="pl-9"
                                        value={stickerForm.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select onValueChange={handleSelectChange} defaultValue={stickerForm.type}>
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

                        {stickerForm.type === "PHYSICAL" && (
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="stock"
                                        type="number"
                                        name="stock"
                                        min="0"
                                        className="pl-9"
                                        value={stickerForm.stock}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="images">Image URL</Label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="images"
                                    type="url"
                                    placeholder="https://example.com/sticker.png"
                                    className="pl-9"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    required
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Paste a direct link to your sticker image (e.g. from Imgur or Google Drive)
                            </p>
                        </div>


                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" /> Creating...
                                </>
                            ) : (
                                "Create Sticker"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default CreateSticker