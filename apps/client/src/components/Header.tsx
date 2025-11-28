import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export function Header() {
    return (
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">StickerValley</h1>
            <div>
                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
                            Sign In
                        </button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </header>
    );
}
