import { Toaster } from '@/components/ui/sonner';
import { Header } from './components/Header';
import { Outlet } from 'react-router';

function App() {
  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen font-sans">
      <div className="mx-auto max-w-7xl">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}

export default App;