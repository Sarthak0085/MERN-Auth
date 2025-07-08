import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Header = () => {
    const navigate = useNavigate();

    const { backendUrl, userData, setUserData, setIsLoggedIn } = useContext(AppContext)!;

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(backendUrl + '/api/v1/auth/logout');
            data.success && setIsLoggedIn(false);
            data.success && setUserData(undefined);
            navigate('/');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="w-full flex items-center justify-between p-4 sm:p-6 sm:px-24 absolute top-0 border-b border-gray-300">
            <img src={assets.logo} alt="Logo" className="w-28 md:w-32" />
            {userData ? (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white relative group">
                    {userData?.name[0].toUpperCase()}
                    <div className="absolute hidden group-hover:block top-8 right-0 z-10 text-black rounded-pt-10">
                        <ul className="list-none m-0 p-2 bg-gray-200 text-sm px-2">
                            <li
                                onClick={() => logout()}
                                className="py-1 px-3 cursor-pointer flex gap-2"
                            >
                                Logout
                                <img src={assets.arrow_icon} alt="Arrow Right" />
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => navigate('/auth?type=login')}
                    className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer"
                >
                    Login
                    <img src={assets.arrow_icon} alt="Arrow Right" />
                </button>
            )}
        </div>
    );
};
export default Header;
