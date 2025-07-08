import { useNavigate, useSearchParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useContext, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Activate = () => {
    const navigate = useNavigate();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [loading, setLoading] = useState<boolean>(false);

    const { backendUrl } = useContext(AppContext)!;

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.split('');
        pasteArray.forEach((char: string, index: number) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        });
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true);
        try {
            e.preventDefault();
            const otpArray = inputRefs.current.map((e) => e?.value);
            const otp = otpArray.join('');

            const { data } = await axios.post(backendUrl + '/api/v1/auth/activate-user', {
                activation_token: token,
                activation_code: otp,
            });

            if (data.success) {
                toast.success('Account Activated successfully. Please login to continue.');
                navigate('/login');
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            console.error('Activate Account Error :', error);
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
                    Email Verify OTP
                </h1>
                <p className="text-indigo-300 text-center mb-6">
                    Enter the code sent to your Email Id
                </p>
                <div onPaste={handlePaste} className="flex justify-between mb-8">
                    {Array(4)
                        .fill(0)
                        .map((_, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                required
                                ref={(el: HTMLInputElement | null) => {
                                    inputRefs.current[index] = el;
                                }}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleInput(e, index)
                                }
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                                    handleKeyDown(e, index)
                                }
                                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                            />
                        ))}
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer">
                    Verify Email{' '}
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
export default Activate;
