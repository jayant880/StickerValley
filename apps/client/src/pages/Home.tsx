import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Landing } from '@/components/Landing';
import { Dashboard } from '@/components/Dashboard';

const Home = () => {
    return (
        <>
            <SignedOut>
                <Landing />
            </SignedOut>
            <SignedIn>
                <Dashboard />
            </SignedIn>
        </>
    )
}

export default Home