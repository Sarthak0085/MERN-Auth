import { useContext, useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import Loader from '../components/Loader';
import Header from '../components/Header';

const Home = () => {
    const { backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext)!;

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/v1/user/me`, {
                    withCredentials: true,
                });

                setIsLoggedIn(true);
                setUserData(res.data.user);
            } catch (err: any) {
                setIsLoggedIn(false);
                console.error('Refresh token failed:', err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        checkLogin();
    }, []);

    return loading ? (
        <Loader />
    ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[url('bg_img.png')] bg-cover bg-center">
            <Header />
            <Hero />
        </div>
    );
};
export default Home;
