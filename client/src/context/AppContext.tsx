import axios from 'axios';
import { createContext, useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';

interface AppContextType {
    backendUrl: string;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    userData: User | undefined;
    setUserData: React.Dispatch<React.SetStateAction<User | undefined>>;
    getUserData: (id: string) => void;
}

interface User {
    _id: string;
    name: string;
    email: string;
    emailVerified: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
    children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userData, setUserData] = useState<User | undefined>(undefined);

    const getUserData = async (id: string) => {
        try {
            const { data } = await axios.get(backendUrl + `/api/v1/user/${id}`);
            data.success ? setUserData(data?.user) : toast.error(data.message);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
