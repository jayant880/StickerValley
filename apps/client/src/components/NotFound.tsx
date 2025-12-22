import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <>
            <title>Sticker Valley | 404 Not Found</title>
            <div className="animate-in fade-in slide-in-from-bottom-4 flex min-h-[70vh] flex-col items-center justify-center space-y-8 px-4 py-12 text-center duration-700">
                <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-indigo-500/10 blur-3xl" />
                    <img
                        src="/404-illustration.png"
                        alt="404 Illustration"
                        className="animate-float relative h-64 w-64 object-contain md:h-80 md:w-80"
                    />
                </div>

                <div className="max-w-md space-y-4">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
                        Wait, youre <span className="text-indigo-600">lost!</span>
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                        It looks like the sticker you're looking for was either peeled off or never
                        existed in this universe.
                    </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="rounded-full px-8 font-bold"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                    </Button>
                    <Link to="/">
                        <Button className="rounded-full bg-indigo-600 px-10 font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700">
                            <Home className="mr-2 h-4 w-4" /> Back to Home
                        </Button>
                    </Link>
                </div>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    .animate-float {
                        animation: float 4s ease-in-out infinite;
                    }
                `}</style>
            </div>
        </>
    );
};

export default NotFound;
