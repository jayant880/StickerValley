import { useParams } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useUserQuery, useUpdateMeMutation } from "../hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Package, Star, Calendar, Mail, ShieldCheck, Edit3, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { UserReview } from "@sticker-valley/shared-types";

const UserProfile = () => {
    const { userId } = useParams();
    const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
    const { data: userData, isLoading, isError } = useUserQuery(userId!);
    const updateMeMutation = useUpdateMeMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");

    useEffect(() => {
        if (userData?.name) {
            setName(userData.name);
        }
    }, [userData]);

    const isOwnProfile = clerkLoaded && clerkUser?.id === userId;

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8 bg-card p-8 rounded-2xl border">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="space-y-4 flex-1">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError || !userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <ShieldCheck className="w-16 h-16 text-muted-foreground/30" />
                <h1 className="text-2xl font-bold">User Not Found</h1>
                <p className="text-muted-foreground text-center max-w-md">
                    The profile you're looking for doesn't exist or you don't have permission to view it.
                </p>
                <Link to="/">
                    <Button variant="outline">Back to Home</Button>
                </Link>
            </div>
        );
    }

    const handleUpdateProfile = () => {
        updateMeMutation.mutate(name, {
            onSuccess: () => setIsEditing(false)
        });
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header */}
            <div className="relative overflow-hidden bg-white p-8 rounded-3xl border shadow-sm mb-8 transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <User className="w-48 h-48" />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <Avatar className="h-32 w-32 rounded-2xl border-4 border-white shadow-xl ring-2 ring-primary/10">
                        <AvatarImage src={userData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`} />
                        <AvatarFallback>{userData.name?.[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            {isEditing ? (
                                <div className="flex items-center gap-2 flex-1 max-w-md">
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="text-2xl font-bold h-12"
                                        placeholder="Enter your name"
                                    />
                                    <Button onClick={handleUpdateProfile} disabled={updateMeMutation.isPending} size="icon">
                                        <Save className="w-4 h-4" />
                                    </Button>
                                    <Button onClick={() => setIsEditing(false)} variant="ghost" size="icon">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                    {userData.name}
                                </h1>
                            )}
                            <div className="flex items-center justify-center gap-2">
                                <Badge variant="secondary" className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors uppercase text-[10px] font-bold tracking-wider">
                                    {userData.role}
                                </Badge>
                                {isOwnProfile && !isEditing && (
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 px-2 text-muted-foreground hover:text-primary transition-colors">
                                        <Edit3 className="w-4 h-4 mr-1" /> Edit
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4 text-indigo-400" />
                                {userData.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-indigo-400" />
                                Joined {new Date(userData.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "Total Orders", value: userData.orders?.length || 0, icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Reviews Given", value: userData.reviews?.length || 0, icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
                    { label: "Level", value: "Verified User", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-50" },
                    { label: "Shop Owner", value: userData.shop ? "Yes" : "No", icon: Edit3, color: "text-purple-500", bg: "bg-purple-50" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:translate-y-[-2px] transition-all duration-300">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                            <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Tabs Container */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 h-auto rounded-2xl grid grid-cols-3 max-w-md mx-auto md:mx-0">
                    <TabsTrigger value="overview" className="rounded-xl py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                    <TabsTrigger value="orders" className="rounded-xl py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Orders</TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-xl py-2.5 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <Card className="border-none shadow-sm bg-indigo-600/5 overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="space-y-4 flex-1">
                                    <h3 className="text-2xl font-bold text-indigo-900 leading-tight">Welcome to your Sticker Valley profile</h3>
                                    <p className="text-indigo-700/80 leading-relaxed max-w-lg">
                                        This is your personal space where you can manage your identity, track your sticker collection, and see how you contribute to our creative community.
                                    </p>
                                    <div className="pt-2">
                                        {userData.shop ? (
                                            <Link to={`/shop/${userData.shop.id}`}>
                                                <Button className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6 rounded-full shadow-lg shadow-indigo-200">Visit Your Shop</Button>
                                            </Link>
                                        ) : (
                                            <Link to="/shop/create">
                                                <Button className="bg-indigo-600 hover:bg-indigo-700 h-10 px-6 rounded-full shadow-lg shadow-indigo-200">Start a Shop</Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="w-48 h-48 bg-white/50 backdrop-blur rounded-3xl border flex items-center justify-center p-8 rotate-3 shadow-xl">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-lg bg-indigo-500/20 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="orders">
                    <Card className="border-none shadow-sm h-full flex flex-col min-h-[400px]">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Package className="w-5 h-5 text-indigo-500" /> Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {!userData.orders || userData.orders.length === 0 ? (
                                <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground bg-gray-50/50 rounded-2xl border-2 border-dashed">
                                    <div className="p-4 bg-white rounded-full shadow-sm">
                                        <Package className="w-10 h-10 opacity-20" />
                                    </div>
                                    <p className="font-medium">No orders found.</p>
                                    <Link to="/stickers">
                                        <Button variant="link">Explore Stickers</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {userData.orders.map((order) => (
                                        <div key={order.id} className="group flex items-center justify-between p-5 rounded-2xl border bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                                            <div className="flex items-center gap-5">
                                                <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold group-hover:scale-110 transition-transform">
                                                    #{order.id.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Order #{order.id.slice(0, 8)}</p>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                                        <Badge variant={order.status === 'PAID' ? 'default' : 'secondary'} className="text-[9px] h-4 py-0 px-1.5 uppercase tracking-tighter">
                                                            {order.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-6">
                                                <div className="space-y-1">
                                                    <p className="text-lg font-black text-gray-900">${Number(order.totalAmount).toFixed(2)}</p>
                                                </div>
                                                <Link to={`/checkout/${order.id}`}>
                                                    <Button size="sm" variant="outline" className="rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">Details</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reviews">
                    <Card className="border-none shadow-sm min-h-[400px]">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" /> Reviews History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!userData.reviews || userData.reviews.length === 0 ? (
                                <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground bg-gray-50/50 rounded-2xl border-2 border-dashed">
                                    <div className="p-4 bg-white rounded-full shadow-sm">
                                        <Star className="w-10 h-10 opacity-20" />
                                    </div>
                                    <p className="font-medium">You haven't left any reviews yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {userData.reviews.map((review: UserReview) => (
                                        <div key={review.id} className="p-6 rounded-2xl border bg-white space-y-4 hover:border-yellow-200 hover:shadow-md transition-all group">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-yellow-50 rounded-xl group-hover:rotate-12 transition-transform">
                                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">Review for {review.sticker?.name || "Sticker"}</p>
                                                        <div className="flex gap-0.5 mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground font-medium">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed italic bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                "{review.comment}"
                                            </p>
                                            {review.stickerId && (
                                                <Link to={`/stickers/${review.stickerId}`} className="inline-flex items-center text-xs font-bold text-indigo-600 hover:underline">
                                                    View Original Sticker →
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserProfile;