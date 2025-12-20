import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const StickerCardSkeleton = () => {
    return (
        <Card className="border-border/50 bg-card flex h-full flex-col overflow-hidden">
            <CardHeader className="p-0">
                <div className="bg-muted/20 relative w-full overflow-hidden pt-[100%]">
                    <Skeleton className="absolute top-0 left-0 h-full w-full" />
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 p-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-6 w-12" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
            </CardFooter>
        </Card>
    );
};
