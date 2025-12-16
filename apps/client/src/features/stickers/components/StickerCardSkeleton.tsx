import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const StickerCardSkeleton = () => {
    return (
        <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card">
            <CardHeader className="p-0">
                <div className="relative w-full pt-[100%] overflow-hidden bg-muted/20">
                    <Skeleton className="absolute top-0 left-0 w-full h-full" />
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 space-y-3">
                <div className="space-y-2">
                    <div className="flex justify-between items-center gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-6 w-12" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 gap-2 grid grid-cols-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
            </CardFooter>
        </Card>
    );
};
