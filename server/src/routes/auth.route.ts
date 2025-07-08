// import { Router } from "express";
// import { activateUser, forgotPassword, loginUser, logoutUser, register, resetPassword, updateAccessToken } from "../controllers/user.controller";
// import { isAuthenticated, isSeller } from "../middleware/auth";
// import { shopRegister, activateShop, loginShop, updateSellerAccessToken, logoutShop, forgotShopPassword, resetShopPassword } from "../controllers/shop.controller";

import { Router } from 'express';
import {
    activateUser,
    forgotPassword,
    loginUser,
    logoutUser,
    register,
    resetPassword,
    updateAccessToken,
} from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middleware/auth.js';

// const authRouter = Router();

const authRouter = Router();

/************** PUBLIC AUTH ROUTES **************/

// CREATE USER
authRouter.post('/create-user', register);

// ACTIVATE USER
authRouter.post('/activate-user', activateUser);

// LOGIN USER
authRouter.post('/login-user', loginUser);

// FORGOT PASSWORD
authRouter.post('/forgot-password', forgotPassword);

// RESET PASSWORD
authRouter.post('/reset-password', resetPassword);

/************** PRIVATE AUTH ROUTES **************/

// LOGOUT USER
authRouter.post('/logout', isAuthenticated, updateAccessToken, logoutUser);

export default authRouter;
