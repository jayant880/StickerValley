import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Header } from './components/Header';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import StickerCard from './components/feature/product/StickerCard';
import type { Sticker } from '@sticker-valley/shared-types';

const sticker: Partial<Sticker> = {
  name: 'Retro Coder',
  description: 'A cool retro coding sticker',
  price: '4.99',
  type: 'PHYSICAL',
  stock: 100,
  shopId: "cbd911d8-7820-42fa-862f-600fb13eac1a",
  isPublished: true,
  images: ['https://placehold.co/400x400/png?text=Retro+Coder']
}

function App() {

  return (
    <div className="bg-gray-50 p-8 min-h-screen font-sans">
      <div className="mx-auto max-w-7xl">
        <Header />
        <main>
          <SignedOut>
            <Landing />
          </SignedOut>
          <SignedIn>
            <Dashboard />
          </SignedIn>
        </main>
        <div>
          <StickerCard sticker={sticker} />
        </div>
      </div>
    </div>
  );
}

export default App;