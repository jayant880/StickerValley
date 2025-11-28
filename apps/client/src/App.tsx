import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Header } from './components/Header';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main>
          <SignedOut>
            <Landing />
          </SignedOut>
          <SignedIn>
            <Dashboard />
          </SignedIn>
        </main>
      </div>
    </div>
  );
}

export default App;