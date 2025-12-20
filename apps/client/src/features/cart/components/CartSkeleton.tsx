import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const CartSkeleton = () => {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <Skeleton className="mb-8 h-10 w-48" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="col-span-1 space-y-4 lg:col-span-2">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <div className="flex gap-4 p-4 sm:gap-6 sm:p-6">
                                <Skeleton className="h-24 w-24 rounded-lg sm:h-32 sm:w-32" />
                                <div className="flex flex-1 flex-col justify-between py-2">
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                <div className="col-span-1">
                    <Card className="h-64 space-y-6 p-6">
                        <Skeleton className="h-6 w-1/3" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="mt-auto h-12 w-full" />
                    </Card>
                </div>
            </div>
        </div>
    );
};
