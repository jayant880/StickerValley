import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CartSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-1 lg:col-span-2 space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <div className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                                <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-lg" />
                                <div className="flex-1 flex flex-col justify-between py-2">
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                <div className="col-span-1">
                    <Card className="h-64 p-6 space-y-6">
                        <Skeleton className="h-6 w-1/3" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="h-12 w-full mt-auto" />
                    </Card>
                </div>
            </div>
        </div>
    );
};
