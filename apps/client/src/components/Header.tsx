import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Home, ShoppingBagIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from './ui/button';

export function Header() {
    return (
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">StickerValley</h1>
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
                        <Link to="/cart">
                            <Button variant="ghost">
                                <ShoppingBagIcon />
                            </Button>
                        </Link>
                    </div>
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
