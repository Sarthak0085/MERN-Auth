import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import { ToastContainer } from 'react-toastify';
import Activate from './pages/Activate';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PublicRoute from './components/PublicRoute';
import NotFound from './pages/Not-Found';

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route element={<PublicRoute />}>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/activate" element={<Activate />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="top-center" />
        </>
    );
};
export default App;
