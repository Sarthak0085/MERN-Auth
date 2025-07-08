import { NextFunction, Request, Response } from 'express';
import { catchAsyncError } from '../middleware/catchAsyncError.js';
import User from '../models/user.model.js';
import ErrorHandler from '../utils/ErrorHandler.js';

// get user info by id
export const getUserInfoById = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(201).send({
                success: true,
                user,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get user
export const getUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;

        const user = await User.findById(userId);
        res.status(201).json({
            success: true,
            user,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
