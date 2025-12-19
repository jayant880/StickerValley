import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Sparkles, ShoppingBag, PlusCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import useOrder from "@/features/order/hooks/useOrder";
import { useQuery } from "@tanstack/react-query";
import { getStickers } from "@/features/stickers/api/sticker.api";
import StickerGrid from "@/features/stickers/components/StickerGrid";

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
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    <p className="text-muted-foreground font-medium animate-pulse">Personalizing your experience...</p>
                </div>
            </div>
        );
    }

    const recentStickers = stickers?.slice(0, 4) || [];
    const hasOrders = orders && orders.length > 0;

    return (
        <div className="container mx-auto px-4 py-8 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-3xl border shadow-sm">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        Hey {user?.firstName}, <span className="text-indigo-600">welcome back!</span>
                    </h2>
                    <p className="text-gray-500 font-medium">Here's what's happening in your Sticker Valley universe.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/stickers">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-6 shadow-lg shadow-indigo-100">
                            <ShoppingBag className="w-4 h-4 mr-2" /> Browse Full Shop
                        </Button>
                    </Link>
                    <Link to="/shop">
                        <Button variant="outline" className="rounded-full px-6">
                            Manage My Shop
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content: Sticker Feed */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            <h3 className="text-2xl font-bold text-gray-900">New for You</h3>
                        </div>
                        <Link to="/stickers" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
                            Explore All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <StickerGrid stickers={recentStickers} loading={false} />
                </div>

                {/* Sidebar: Activity & Actions */}
                <div className="space-y-8">
                    {/* Orders Card */}
                    <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Package className="w-4 h-4 text-indigo-500" /> Recent Orders
                            </h3>
                            {hasOrders && <Link to="/profile" className="text-xs font-bold text-indigo-600">History</Link>}
                        </div>

                        {!hasOrders ? (
                            <div className="text-center py-8 space-y-4">
                                <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                    <ShoppingBag className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium px-4">You haven't made any orders yet. Ready to start your collection?</p>
                                <Link to="/stickers" className="inline-block">
                                    <Button variant="secondary" size="sm" className="rounded-full">Start Shopping</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders?.slice(0, 3).map((order) => (
                                    <Link key={order.id} to={`/checkout/${order.id}`}>
                                        <div className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-transparent hover:border-indigo-100 hover:shadow-md transition-all">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">#{order.id.slice(0, 6).toUpperCase()}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-gray-900">${Number(order.totalAmount).toFixed(2)}</p>
                                                <Badge variant={order.status === 'PAID' ? 'default' : 'secondary'} className="text-[8px] h-4 py-0 px-1 uppercase font-bold tracking-tighter">
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
                    <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <PlusCircle className="w-24 h-24" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-xl font-bold leading-tight">Create your own masterpieces.</h3>
                            <p className="text-indigo-100 text-sm leading-relaxed">
                                Turn your designs into stickers and join our community of vendors.
                            </p>
                            <Link to="/shop" className="block">
                                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl h-11">
                                    Start Selling
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
