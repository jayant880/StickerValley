import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Package, Sparkles, ShoppingBag, PlusCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useUser } from '@clerk/clerk-react';
import useOrder from '@/features/order/hooks/useOrder';
import { useQuery } from '@tanstack/react-query';
import { getStickers } from '@/features/stickers/api/sticker.api';
import StickerGrid from '@/features/stickers/components/StickerGrid';

export function Dashboard() {
    const { user, isLoaded } = useUser();
    const { useOrderQuery } = useOrder();
    const { data: orders, isLoading: isLoadingOrders } = useOrderQuery();
    const { data: stickers, isLoading: isLoadingStickers } = useQuery({
        queryKey: ['dashboard-stickers'],
        queryFn: () => getStickers(),
    });

    if (!isLoaded || isLoadingOrders || isLoadingStickers) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-10 w-10 text-indigo-600" />
                    <p className="text-muted-foreground animate-pulse font-medium">
                        Personalizing your experience...
                    </p>
                </div>
            </div>
        );
    }

    const recentStickers = stickers?.slice(0, 4) || [];
    const hasOrders = orders && orders.length > 0;

    return (
        <>
            <title>Sticker Valley | Dashboard</title>
            <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto space-y-16 px-4 py-8 duration-700">
                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border bg-white p-8 shadow-sm md:flex-row md:items-center">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black tracking-tight text-gray-900">
                            Hey {user?.firstName},{' '}
                            <span className="text-indigo-600">welcome back!</span>
                        </h2>
                        <p className="font-medium text-gray-500">
                            Here's what's happening in your Sticker Valley universe.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/stickers">
                            <Button className="rounded-full bg-indigo-600 px-6 shadow-lg shadow-indigo-100 hover:bg-indigo-700">
                                <ShoppingBag className="mr-2 h-4 w-4" /> Browse Full Shop
                            </Button>
                        </Link>
                        <Link to="/shop">
                            <Button variant="outline" className="rounded-full px-6">
                                Manage My Shop
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Main Content: Sticker Feed */}
                    <div className="space-y-8 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-indigo-500" />
                                <h3 className="text-2xl font-bold text-gray-900">New for You</h3>
                            </div>
                            <Link
                                to="/stickers"
                                className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:underline"
                            >
                                Explore All <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <StickerGrid stickers={recentStickers} loading={isLoadingStickers} />
                    </div>

                    {/* Sidebar: Activity & Actions */}
                    <div className="space-y-8">
                        {/* Orders Card */}
                        <div className="space-y-6 rounded-3xl border border-gray-100 bg-gray-50/50 p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-lg font-bold">
                                    <Package className="h-4 w-4 text-indigo-500" /> Recent Orders
                                </h3>
                                {hasOrders && (
                                    <Link
                                        to="/profile"
                                        className="text-xs font-bold text-indigo-600"
                                    >
                                        History
                                    </Link>
                                )}
                            </div>

                            {!hasOrders ? (
                                <div className="space-y-4 py-8 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                                        <ShoppingBag className="h-6 w-6 text-gray-300" />
                                    </div>
                                    <p className="px-4 text-sm font-medium text-gray-500">
                                        You haven't made any orders yet. Ready to start your
                                        collection?
                                    </p>
                                    <Link to="/stickers" className="inline-block">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="rounded-full"
                                        >
                                            Start Shopping
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {orders?.slice(0, 3).map((order) => (
                                        <Link key={order.id} to={`/checkout/${order.id}`}>
                                            <div className="group flex items-center justify-between rounded-2xl border border-transparent bg-white p-4 transition-all hover:border-indigo-100 hover:shadow-md">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                                                        #{order.id.slice(0, 6).toUpperCase()}
                                                    </p>
                                                    <p className="text-muted-foreground text-[10px] font-medium">
                                                        {new Date(
                                                            order.createdAt,
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-gray-900">
                                                        ${Number(order.totalAmount).toFixed(2)}
                                                    </p>
                                                    <Badge
                                                        variant={
                                                            order.status === 'PAID'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className="h-4 px-1 py-0 text-[8px] font-bold tracking-tighter uppercase"
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Create CTA */}
                        <div className="group relative overflow-hidden rounded-3xl bg-indigo-600 p-8 text-white">
                            <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform duration-500 group-hover:scale-110">
                                <PlusCircle className="h-24 w-24" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-xl leading-tight font-bold">
                                    Create your own masterpieces.
                                </h3>
                                <p className="text-sm leading-relaxed text-indigo-100">
                                    Turn your designs into stickers and join our community of
                                    vendors.
                                </p>
                                <Link to="/shop" className="block">
                                    <Button className="h-11 w-full rounded-xl bg-white font-bold text-indigo-600 hover:bg-indigo-50">
                                        Start Selling
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
