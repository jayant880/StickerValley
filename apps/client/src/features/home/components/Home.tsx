import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Landing } from './Landing';
import { Dashboard } from '@/features/dashboard/components/Dashboard';

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