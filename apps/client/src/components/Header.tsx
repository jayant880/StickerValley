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
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
            <Link to="/">
                <h1 className="text-3xl font-bold text-gray-900 cursor-pointer">StickerValley</h1>
            </Link>
            <div className="flex gap-4">
                <div className="flex gap-2 items-center">
                    <div>
                        <Link to="/">
                            <Button variant="ghost">
                                <Home />
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <Link to="/stickers">
                            <Button variant="ghost">
                                Stickers
                            </Button>
                        </Link>
                    </div>
                    <div>
                        <Link to="/wishlist">
                            <Button variant="ghost" className="relative">
                                <Heart />
                                {wishlist && wishlist.length > 0 ? (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
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
                                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.totalItems}
                                    </span>
                                ) : null}
                            </Button>
                        </Link>
                    </div>
                    <SignedIn>
                        <Link to={`/profile/${user?.id}`}>
                            <Button variant="ghost">
                                <User />
                            </Button>
                        </Link>
                    </SignedIn>
                </div>
                <SignedOut>
                    <SignInButton mode="modal">
                        <Button variant="ghost">
                            Sign In
                        </Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </header>
    );
}
