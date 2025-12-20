import { useParams } from 'react-router';
import { useUser } from '@clerk/clerk-react';
import { useUserQuery, useUpdateMeMutation } from '../hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Package, Star, Calendar, Mail, ShieldCheck, Edit3, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { UserReview } from '@sticker-valley/shared-types';

const UserProfile = () => {
    const { userId } = useParams();
    const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
    const { data: userData, isLoading, isError } = useUserQuery(userId!);
    const updateMeMutation = useUpdateMeMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        if (userData?.name) {
            setName(userData.name);
        }
    }, [userData]);

    const isOwnProfile = clerkLoaded && clerkUser?.id === userId;

    if (isLoading) {
        return (
            <div className="container mx-auto max-w-5xl space-y-8 px-4 py-12">
                <div className="bg-card flex flex-col items-center gap-8 rounded-2xl border p-8 md:flex-row">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-6 w-48" />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError || !userData) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
                <ShieldCheck className="text-muted-foreground/30 h-16 w-16" />
                <h1 className="text-2xl font-bold">User Not Found</h1>
                <p className="text-muted-foreground max-w-md text-center">
                    The profile you're looking for doesn't exist or you don't have permission to
                    view it.
                </p>
                <Link to="/">
                    <Button variant="outline">Back to Home</Button>
                </Link>
            </div>
        );
    }

    const handleUpdateProfile = () => {
        updateMeMutation.mutate(name, {
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto max-w-6xl px-4 py-12 duration-700">
            {/* Profile Header */}
            <div className="relative mb-8 overflow-hidden rounded-3xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <User className="h-48 w-48" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
                    <Avatar className="ring-primary/10 h-32 w-32 rounded-2xl border-4 border-white shadow-xl ring-2">
                        <AvatarImage
                            src={
                                userData.avatarUrl ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`
                            }
                        />
                        <AvatarFallback>{userData.name?.[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            {isEditing ? (
                                <div className="flex max-w-md flex-1 items-center gap-2">
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-12 text-2xl font-bold"
                                        placeholder="Enter your name"
                                    />
                                    <Button
                                        onClick={handleUpdateProfile}
                                        disabled={updateMeMutation.isPending}
                                        size="icon"
                                    >
                                        <Save className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={() => setIsEditing(false)}
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                                    {userData.name}
                                </h1>
                            )}
                            <div className="flex items-center justify-center gap-2">
                                <Badge
                                    variant="secondary"
                                    className="bg-indigo-50 px-3 py-1 text-[10px] font-bold tracking-wider text-indigo-700 uppercase transition-colors hover:bg-indigo-100"
                                >
                                    {userData.role}
                                </Badge>
                                {isOwnProfile && !isEditing && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                        className="text-muted-foreground hover:text-primary h-8 px-2 transition-colors"
                                    >
                                        <Edit3 className="mr-1 h-4 w-4" /> Edit
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm md:justify-start">
                            <div className="flex items-center gap-1.5">
                                <Mail className="h-4 w-4 text-indigo-400" />
                                {userData.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-indigo-400" />
                                Joined{' '}
                                {new Date(userData.createdAt).toLocaleDateString(undefined, {
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4">
                {[
                    {
                        label: 'Total Orders',
                        value: userData.orders?.length || 0,
                        icon: Package,
                        color: 'text-blue-500',
                        bg: 'bg-blue-50',
                    },
                    {
                        label: 'Reviews Given',
                        value: userData.reviews?.length || 0,
                        icon: Star,
                        color: 'text-yellow-500',
                        bg: 'bg-yellow-50',
                    },
                    {
                        label: 'Level',
                        value: 'Verified User',
                        icon: ShieldCheck,
                        color: 'text-green-500',
                        bg: 'bg-green-50',
                    },
                    {
                        label: 'Shop Owner',
                        value: userData.shop ? 'Yes' : 'No',
                        icon: Edit3,
                        color: 'text-purple-500',
                        bg: 'bg-purple-50',
                    },
                ].map((stat, i) => (
                    <Card
                        key={i}
                        className="border-none shadow-sm transition-all duration-300 hover:translate-y-[-2px]"
                    >
                        <CardContent className="flex flex-col items-center justify-center space-y-2 p-6 text-center">
                            <div className={`rounded-2xl p-3 ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
                                {stat.label}
                            </p>
                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Tabs Container */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted/50 mx-auto grid h-auto max-w-md grid-cols-3 rounded-2xl p-1 md:mx-0">
                    <TabsTrigger
                        value="overview"
                        className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="orders"
                        className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        Orders
                    </TabsTrigger>
                    <TabsTrigger
                        value="reviews"
                        className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        Reviews
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <Card className="overflow-hidden border-none bg-indigo-600/5 shadow-sm">
                        <CardContent className="p-8">
                            <div className="flex flex-col items-center gap-8 md:flex-row">
                                <div className="flex-1 space-y-4">
                                    <h3 className="text-2xl leading-tight font-bold text-indigo-900">
                                        Welcome to your Sticker Valley profile
                                    </h3>
                                    <p className="max-w-lg leading-relaxed text-indigo-700/80">
                                        This is your personal space where you can manage your
                                        identity, track your sticker collection, and see how you
                                        contribute to our creative community.
                                    </p>
                                    <div className="pt-2">
                                        {userData.shop ? (
                                            <Link to={`/shop/${userData.shop.id}`}>
                                                <Button className="h-10 rounded-full bg-indigo-600 px-6 shadow-lg shadow-indigo-200 hover:bg-indigo-700">
                                                    Visit Your Shop
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link to="/shop/create">
                                                <Button className="h-10 rounded-full bg-indigo-600 px-6 shadow-lg shadow-indigo-200 hover:bg-indigo-700">
                                                    Start a Shop
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="flex h-48 w-48 rotate-3 items-center justify-center rounded-3xl border bg-white/50 p-8 shadow-xl backdrop-blur">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="h-10 w-10 animate-pulse rounded-lg bg-indigo-500/20"
                                                style={{ animationDelay: `${i * 150}ms` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="orders">
                    <Card className="flex h-full min-h-[400px] flex-col border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                <Package className="h-5 w-5 text-indigo-500" /> Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            {!userData.orders || userData.orders.length === 0 ? (
                                <div className="text-muted-foreground flex h-[300px] flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed bg-gray-50/50 text-center">
                                    <div className="rounded-full bg-white p-4 shadow-sm">
                                        <Package className="h-10 w-10 opacity-20" />
                                    </div>
                                    <p className="font-medium">No orders found.</p>
                                    <Link to="/stickers">
                                        <Button variant="link">Explore Stickers</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {userData.orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="group flex items-center justify-between rounded-2xl border bg-white p-5 transition-all duration-300 hover:border-indigo-200 hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 font-bold text-indigo-600 transition-transform group-hover:scale-110">
                                                    #{order.id.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                                                        Order #{order.id.slice(0, 8)}
                                                    </p>
                                                    <div className="text-muted-foreground flex items-center gap-3 text-xs font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />{' '}
                                                            {new Date(
                                                                order.createdAt,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                        <Badge
                                                            variant={
                                                                order.status === 'PAID'
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                            className="h-4 px-1.5 py-0 text-[9px] tracking-tighter uppercase"
                                                        >
                                                            {order.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 text-right">
                                                <div className="space-y-1">
                                                    <p className="text-lg font-black text-gray-900">
                                                        ${Number(order.totalAmount).toFixed(2)}
                                                    </p>
                                                </div>
                                                <Link to={`/checkout/${order.id}`}>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="rounded-xl transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                                    >
                                                        Details
                                                    </Button>
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
                    <Card className="min-h-[400px] border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                <Star className="h-5 w-5 text-yellow-500" /> Reviews History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!userData.reviews || userData.reviews.length === 0 ? (
                                <div className="text-muted-foreground flex h-[300px] flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed bg-gray-50/50 text-center">
                                    <div className="rounded-full bg-white p-4 shadow-sm">
                                        <Star className="h-10 w-10 opacity-20" />
                                    </div>
                                    <p className="font-medium">You haven't left any reviews yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {userData.reviews.map((review: UserReview) => (
                                        <div
                                            key={review.id}
                                            className="group space-y-4 rounded-2xl border bg-white p-6 transition-all hover:border-yellow-200 hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="rounded-xl bg-yellow-50 p-2 transition-transform group-hover:rotate-12">
                                                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">
                                                            Review for{' '}
                                                            {review.sticker?.name || 'Sticker'}
                                                        </p>
                                                        <div className="mt-1 flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground text-xs font-medium">
                                                    {new Date(
                                                        review.createdAt,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <p className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-600 italic">
                                                "{review.comment}"
                                            </p>
                                            {review.stickerId && (
                                                <Link
                                                    to={`/stickers/${review.stickerId}`}
                                                    className="inline-flex items-center text-xs font-bold text-indigo-600 hover:underline"
                                                >
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
