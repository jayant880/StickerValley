import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import useStickers from '../hooks/useStickers';

interface DeleteStickerDialogProps {
    stickerId: string;
    stickerName: string;
}

const DeleteStickerDialog = ({ stickerId, stickerName }: DeleteStickerDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { useDeleteSticker } = useStickers();
    const deleteStickerMutation = useDeleteSticker();

    const handleDelete = () => {
        deleteStickerMutation.mutate(stickerId, {
            onSuccess: () => {
                toast.success('Sticker deleted successfully');
                setIsOpen(false);
                navigate('/stickers');
            },
            onError: (error) => {
                toast.error('Failed to delete sticker');
                console.error(error);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Sticker
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-center">Confirm Deletion</DialogTitle>
                    <DialogDescription className="text-center">
                        Are you sure you want to delete{' '}
                        <span className="text-foreground font-semibold">"{stickerName}"</span>? This
                        action cannot be undone and will permanently remove this sticker from your
                        shop.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex-col gap-2 sm:flex-row sm:justify-center">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        className="w-full sm:w-auto"
                        onClick={handleDelete}
                        disabled={deleteStickerMutation.isPending}
                    >
                        {deleteStickerMutation.isPending ? 'Deleting...' : 'Permanently Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteStickerDialog;
