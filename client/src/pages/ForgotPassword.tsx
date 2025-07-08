import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const context = useContext(AppContext);

    if (!context) {
        throw new Error('AppContext must be used within an AppContextProvider');
    }

    const { backendUrl } = context;

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        try {
            e.preventDefault();
            const { data } = await axios.post(backendUrl + '/api/v1/auth/forgot-password', {
                email,
            });

            if (data.success) {
                toast.success(data?.message);
                navigate(`/reset-password?token=${data?.resetToken}`);
            }
        } catch (error: any) {
            console.error('Forgot Password Error :', error);
            toast.error(error.response.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 via-purple-300 to-teal-400 ">
            <img
                onClick={() => navigate('/')}
                src={assets.logo}
                alt="Logo"
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
            />
            <form
                onSubmit={onSubmitHandler}
                className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm"
            >
                <h1 className="text-2xl font-semibold text-white text-center mb-4">
                    Forgot Password
                </h1>
                <p className="text-indigo-300 text-center mb-6">
                    Enter your register email address
                </p>
                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                    <img src={assets.mail_icon} alt="Email Icon" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Id"
                        className="bg-transparent outline-none"
                        required
                    />
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
                    Send OTP{' '}
                    {loading && (
                        <div className="animate-spin rounded-full w-4 h-4 border-2 border-t-blue-600 pl-2" />
                    )}
                </button>
                <p className="text-gray-400 text-center text-xs mt-4">
                    Already have an account?{' '}
                    <span
                        onClick={() => {
                            navigate('/auth?type=login');
                        }}
                        className="text-blue-400 cursor-pointer underline"
                    >
                        Login here
                    </span>
                </p>
            </form>
        </div>
    );
};
export default ForgotPassword;
