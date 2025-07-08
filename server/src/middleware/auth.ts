import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { catchAsyncError } from './catchAsyncError.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import User from '../models/user.model.js';

export const isAuthenticated = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // find access token from cookies
            const accessToken = req.cookies.access_token;
            if (!accessToken) {
                return next(new ErrorHandler('Please login first to access this', 400));
            }

            // decode the id
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN!) as JwtPayload;
            if (!decoded) {
                return next(new ErrorHandler('Access token is not valid', 400));
            }

            // find the user
            const user = await User.findById(decoded.id);
            if (!user) {
                return next(new ErrorHandler('Please login to access this resource', 400));
            }

            req.user = user;

            next();
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
