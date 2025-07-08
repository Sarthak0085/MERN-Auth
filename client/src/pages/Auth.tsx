import { useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const Auth = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const navigate = useNavigate();

    const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext)!;

    const [state, setState] = useState<string>(type || 'register');
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        try {
            e.preventDefault();
            axios.defaults.withCredentials = true;

            if (state === 'register') {
                const { data } = await axios.post(backendUrl + '/api/v1/auth/create-user', {
                    name,
                    email,
                    password,
                });

                if (data.success) {
                    toast.success(data?.message);
                    navigate(`/activate?token=${data?.activationToken}`);
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/v1/auth/login-user', {
                    email,
                    password,
                });

                if (data.success) {
                    setIsLoggedIn(true);
                    getUserData(data?.user?._id);
                    navigate('/');
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error: any) {
            console.error('Auth Error :', error);
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

            <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
                <h2 className="text-3xl font-semibold text-white text-center mb-3">
                    {state === 'register' ? 'Create Account' : 'Login'}
                </h2>
                <p className="text-sm text-center mb-6">
                    {state === 'register' ? 'Create your account' : 'Login to your account!'}
                </p>

                <form onSubmit={(e) => onSubmitHandler(e)}>
                    {state === 'register' && (
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <img src={assets.person_icon} alt="Person Icon" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                className="bg-transparent outline-none"
                                required
                            />
                        </div>
                    )}

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

                    <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                        <img src={assets.lock_icon} alt="Password Icon" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="bg-transparent outline-none"
                            required
                        />
                    </div>

                    <p
                        onClick={() => navigate('/forgot-password')}
                        className="mb-4 text-indigo-500 cursor-pointer"
                    >
                        forgot password?
                    </p>

                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
                        {state}{' '}
                        {loading && (
                            <div className="animate-spin rounded-full w-4 h-4 border-2 border-t-blue-600" />
                        )}
                    </button>
                </form>

                {state === 'register' ? (
                    <p className="text-gray-400 text-center text-xs mt-4">
                        Already have an account?{' '}
                        <span
                            onClick={() => {
                                navigate('/auth?type=login');
                                setState('login');
                            }}
                            className="text-blue-400 cursor-pointer underline"
                        >
                            Login here
                        </span>
                    </p>
                ) : (
                    <p className="text-gray-400 text-center text-xs mt-4">
                        Don't have an account?{' '}
                        <span
                            onClick={() => {
                                (navigate('/auth?type=register'), setState('register'));
                            }}
                            className="text-blue-400 cursor-pointer underline"
                        >
                            Sign up
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Auth;
