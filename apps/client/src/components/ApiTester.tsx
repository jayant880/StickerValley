import { useAuth } from '@clerk/clerk-react';
import { useState } from 'react';

export function ApiTester() {
    const { getToken } = useAuth();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const testConnection = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await fetch('http://localhost:5000/api/protected', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setMessage(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(error);
            setMessage('Error connecting to server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 border rounded-lg bg-white shadow-sm max-w-md mx-auto mt-8">
            <h3 className="text-lg font-semibold mb-4">Backend Connection Test</h3>
            <button
                onClick={testConnection}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
            >
                {isLoading ? 'Testing...' : 'Call Protected API'}
            </button>
            {message && (
                <div className="mt-4 text-left">
                    <p className="text-sm text-gray-500 mb-1">Response:</p>
                    <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto border max-h-60">
                        {message}
                    </pre>
                </div>
            )}
        </div>
    );
}
