import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Heart, Home, ShoppingBagIcon, User } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from './ui/button';
import { useCartQuery } from '@/features/cart/hooks/useCart';
import { useWishlistQuery } from '@/features/wishlist/hooks/useWishlist';

export function Header() {
    const { data: cart } = useCartQuery();
    const { data: wishlist } = useWishlistQuery();
    const { user } = useUser();
    return (
        <header className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
            <Link to="/">
                <h1 className="cursor-pointer text-3xl font-bold text-gray-900">StickerValley</h1>
            </Link>
            <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <div>
                        <Link to="/">
                            <Button variant="ghost">
                                <Home />
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <Link to="/stickers">
                            <Button variant="ghost">Stickers</Button>
                        </Link>
                    </div>
                    <SignedIn>
                        <div>
                            <Link to="/wishlist">
                                <Button variant="ghost" className="relative">
                                    <Heart />
                                    {wishlist && wishlist.length > 0 ? (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                            {wishlist.length}
                                        </span>
                                    ) : null}
                                </Button>
                            </Link>
                        </div>
                        <div>
                            <Link to="/cart">
                                <Button variant="ghost" className="relative">
                                    <ShoppingBagIcon />
                                    {cart?.totalItems ? (
                                        <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                                            {cart.totalItems}
                                        </span>
                                    ) : null}
                                </Button>
                            </Link>
                        </div>
                        <Link to={`/profile/${user?.id}`}>
                            <Button variant="ghost">
                                <User />
                            </Button>
                        </Link>
                    </SignedIn>
                </div>
                <SignedOut>
                    <SignInButton mode="modal">
                        <Button variant="ghost">Sign In</Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </header>
    );
}
