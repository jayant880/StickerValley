import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Image as ImageIcon, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useStickerStore } from '../store/stickersStore';
import useStickers from '../hooks/useStickers';
import type { StickerWithRelations } from '@sticker-valley/shared-types';

interface EditStickerDialogProps {
    sticker: StickerWithRelations;
}

const EditStickerDialog = ({ sticker }: EditStickerDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { stickerForm, stickerFormActions } = useStickerStore();
    const { useUpdateSticker } = useStickers();
    const updateStickerMutation = useUpdateSticker(sticker.id);

    const handleOpen = () => {
        stickerFormActions.setName(sticker.name);
        stickerFormActions.setDescription(sticker.description || '');
        stickerFormActions.setPrice(sticker.price.toString());
        stickerFormActions.setType(sticker.type);
        stickerFormActions.setStock(sticker.stock || 0);
        stickerFormActions.setImages(sticker.images || []);
        setIsOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        const filteredImages = stickerForm.images.filter((url: string) => url.trim() !== '');
        if (filteredImages.length === 0) {
            toast.error('At least one valid image URL is required');
            return;
        }

        stickerFormActions.setImages(filteredImages);

        updateStickerMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success('Sticker updated successfully');
                setIsOpen(false);
            },
            onError: (error: Error) => {
                toast.error('Failed to update sticker');
                console.error(error);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={handleOpen} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Sticker
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Sticker</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdate}>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Sticker Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={stickerForm.name}
                                onChange={(e) => stickerFormActions.setName(e.target.value)}
                                placeholder="Enter sticker name"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={stickerForm.price}
                                    onChange={(e) => stickerFormActions.setPrice(e.target.value)}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={stickerForm.type}
                                    onValueChange={(val: 'DIGITAL' | 'PHYSICAL') =>
                                        stickerFormActions.setType(val)
                                    }
                                >
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
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    value={stickerForm.stock}
                                    onChange={(e) =>
                                        stickerFormActions.setStock(Number(e.target.value))
                                    }
                                    placeholder="0"
                                    required
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={stickerForm.description}
                                onChange={(e) => stickerFormActions.setDescription(e.target.value)}
                                placeholder="Describe your sticker..."
                                className="min-h-[120px]"
                                required
                            />
                        </div>
                        <div className="space-y-4">
                            <Label>Images</Label>
                            {stickerForm.images.map((url: string, index: number) => (
                                <div key={index} className="relative flex gap-2">
                                    <div className="relative flex-1">
                                        <ImageIcon className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                                        <Input
                                            type="url"
                                            placeholder="https://example.com/sticker.png"
                                            className="pl-9"
                                            value={url}
                                            onChange={(e) => {
                                                const newImages = [...stickerForm.images];
                                                newImages[index] = e.target.value;
                                                stickerFormActions.setImages(newImages);
                                            }}
                                            required
                                        />
                                    </div>
                                    {stickerForm.images.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => {
                                                const newImages = [...stickerForm.images];
                                                newImages.splice(index, 1);
                                                stickerFormActions.setImages(newImages);
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
                                onClick={() =>
                                    stickerFormActions.setImages([...stickerForm.images, ''])
                                }
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Another Image
                            </Button>
                        </div>
                    </div>
                    <DialogFooter className="bg-background sticky bottom-0 border-t pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={updateStickerMutation.isPending}>
                            {updateStickerMutation.isPending ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4" /> Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditStickerDialog;
