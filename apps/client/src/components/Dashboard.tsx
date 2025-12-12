import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { orderService } from "@/service/orderService";
import type { Order } from "@sticker-valley/shared-types";
import { Loader2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";

export function Dashboard() {
    const { user, isLoaded } = useUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const data = await orderService.getOrders();
                if (data?.orders) {
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded) {
            fetchOrders();
        }
    }, [user, isLoaded]);

    if (!isLoaded || loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="text-center py-10 container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Welcome back, {user?.firstName}</h2>
            <p className="text-lg text-gray-600 mb-12">Manage your stickers and orders.</p>
            <div className="mb-12">
                <Link to="/stickers"><Button size="lg">Browse Stickers</Button></Link>
            </div>


            <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto text-left">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <h3 className="text-xl font-semibold mb-4">My Stickers</h3>
                    <div className="flex flex-col items-center justify-center flex-1 text-gray-500 py-8">
                        <p>You haven't uploaded any stickers yet.</p>
                        <Button variant="link" className="mt-2">Start Selling</Button>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
                    {orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-gray-500 py-8">
                            <Package className="w-12 h-12 mb-2 text-gray-300" />
                            <p>No recent orders found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-bold">${Number(order.totalAmount).toFixed(2)}</p>
                                            <Badge variant={order.status === 'PAID' ? 'default' : 'secondary'} className="text-[10px] px-1.5 h-5">
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <Link to={`/checkout/${order.id}`}>
                                            <Button variant="ghost" size="sm">View</Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
