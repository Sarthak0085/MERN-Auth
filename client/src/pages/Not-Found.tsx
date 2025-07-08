import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">404</h1>
                <p className="text-xl text-gray-600 mt-2">Page Not Found</p>
                <p className="text-sm text-gray-500 mt-1">
                    The page you are looking for doesn’t exist or has been moved.
                </p>
                <button
                    className="mt-6 cursor-pointer p-2 bg-blue-500 text-white"
                    onClick={() => navigate('/')}
                >
                    ← Go back to Home
                </button>
            </div>
        </div>
    );
}
