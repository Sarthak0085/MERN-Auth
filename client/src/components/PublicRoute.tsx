import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const PublicRoute = () => {
    const { isLoggedIn } = useContext(AppContext)!;

    return isLoggedIn ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
