import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { catchAsyncError } from '../middleware/catchAsyncError.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import User, { IUser } from '../models/user.model.js';
import sendEmail from '../utils/sendMail.js';
import { accessTokenOptions, refreshTokenOptions, sendToken } from '../utils/jwt.js';

interface IRegistrationbody {
    name: string;
    email: string;
    password?: string;
}

// register user
export const register = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body as IRegistrationbody;

        if (!name || name === '' || !email || email === '' || !password || password === '') {
            return next(new ErrorHandler('Please fill all the details', 401));
        }

        const userEmail = await User.findOne({ email });

        if (userEmail) {
            return next(new ErrorHandler('User already exists', 409));
        }

        const user = {
            name: name,
            email: email,
            password: password,
        };

        const activationToken = createActivationToken(user);

        const activationCode = activationToken.activationCode;

        const data = { user: { name: user.name }, activationCode };

        // const html = await ejs.renderFile(path.join(__dirname, "../mails/activationMail.ejs"), data);

        try {
            await sendEmail({
                email: user.email,
                subject: 'Activate your account',
                template: 'activationMail.ejs',
                data: {
                    user: { name: user.name },
                    activationCode,
                },
            });

            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account.`,
                activationToken: activationToken.token,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IActivationToken {
    activationCode: string;
    token: string;
}

// create activation token
export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
        {
            user,
            activationCode,
        },
        process.env.ACTIVATION_SECRET as Secret,
        {
            expiresIn: '5m',
        }
    );

    return { activationCode, token };
};

interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

// activate user
export const activateUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { activation_token, activation_code } = req.body as IActivationRequest;

            if (
                !activation_token ||
                activation_token === '' ||
                !activation_code ||
                activation_code === ''
            ) {
                return next(new ErrorHandler('Please fill all the details', 401));
            }

            const newUser: { user: IUser; activationCode: string } = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET as string
            ) as { user: IUser; activationCode: string };

            if (newUser.activationCode !== activation_code) {
                return next(new ErrorHandler('Invalid Activation Code', 400));
            }
            const { name, email, password } = newUser.user;
            const existUser = await User.findOne({ email });

            if (existUser) {
                return next(new ErrorHandler('Email Already Exist', 400));
            }

            const hashPassword = await bcrypt.hash(password!, 10);

            const user = await User.create({
                name,
                email,
                password: hashPassword,
                emailVerified: true,
            });

            res.status(200).send({
                success: true,
                user,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

interface ILoginRequest {
    email: string;
    password: string;
}

// login user
export const loginUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body as ILoginRequest;

            if (!email || !password) {
                return next(new ErrorHandler('Please provide both email and password', 400));
            }

            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                return next(new ErrorHandler('User not found. Please register first.', 404));
            }

            const isPasswordMatched = await user.comparePassword(password);

            if (!isPasswordMatched) {
                return next(new ErrorHandler('Invalid email or password', 400));
            }

            sendToken(user, 200, res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//logout user
export const logoutUser = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.cookie('access_token', '', { maxAge: 1 });
            res.cookie('refresh_token', '', { maxAge: 1 });
            const userId = req.user?._id || '';

            res.status(200).json({
                success: true,
                message: 'Logout Successfully',
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

export const updateAccessToken = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const refresh_token = req.cookies.refresh_token as string;

        if (!refresh_token) {
            return next(new ErrorHandler('Please login to access this', 400));
        }

        const decoded = jwt.verify(
            refresh_token,
            process.env.REFRESH_TOKEN as string
        ) as JwtPayload;

        if (!decoded || !decoded.id) {
            return next(new ErrorHandler('Invalid refresh token', 400));
        }

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        req.user = user;

        const newAccessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, {
            expiresIn: '5m',
        });

        const newRefreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, {
            expiresIn: '3d',
        });

        res.cookie('access_token', newAccessToken, accessTokenOptions);
        res.cookie('refresh_token', newRefreshToken, refreshTokenOptions);

        next();
    }
);

// forgot password
export const forgotPassword = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorHandler('User Not found. Please Register first', 401));
        }

        const resetToken = createResetToken(user);
        user.save();
        const activationCode = resetToken.resetOtp;

        const data = { user: { name: user.name }, activationCode };

        try {
            await sendEmail({
                email: user.email,
                subject: 'Reset Password',
                template: 'resetMail.ejs',
                data,
            });

            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to reset your password.`,
                resetToken: resetToken.resetToken,
            });
        } catch (error: any) {
            user.resetPasswordToken = undefined;
            user.resetOtp = undefined;
            user.save();
            console.log(error);

            return next(new ErrorHandler(error.message, 500));
        }
    }
);

interface ICreateResetToken {
    resetOtp: string;
    resetToken: string;
    user: any;
}

// Create Reset Token
export const createResetToken = (user: any): ICreateResetToken => {
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = jwt.sign(
        {
            user,
            resetOtp,
        },
        process.env.RESET_SECRET as Secret,
        {
            expiresIn: '10m',
        }
    );

    user.resetPasswordToken = resetToken;
    user.resetOtp = resetOtp;
    user.resetTokenExpires = Date.now() + 10 * 60 * 1000;

    return { resetOtp, resetToken, user };
};

interface IResetPasswordRequest {
    reset_token: string;
    reset_otp: string;
    newPassword: string;
}

export const resetPassword = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { reset_token, newPassword, reset_otp } = req.body as IResetPasswordRequest;

        if (!reset_token || reset_token === '') {
            return next(new ErrorHandler('Reset Token Expires', 404));
        }

        if (
            !reset_otp ||
            reset_otp === '' ||
            !newPassword ||
            newPassword === '' ||
            !reset_token ||
            reset_token === ''
        ) {
            return next(new ErrorHandler('Please fill all the details', 401));
        }

        const payload: { user: IUser; resetOtp: string; resetToken: string } = jwt.verify(
            reset_token,
            process.env.RESET_SECRET as string
        ) as { user: IUser; resetOtp: string; resetToken: string };

        if (payload.resetOtp !== reset_otp) {
            return next(new ErrorHandler('Invalid OTP', 400));
        }

        const user = await User.findById(payload.user._id);

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        if (user.resetTokenExpires === undefined) {
            return next(new ErrorHandler('Reset token has expired', 400));
        }

        try {
            const hashPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashPassword;
            user.resetPasswordToken = undefined;
            user.resetTokenExpires = undefined;
            user.resetOtp = undefined;

            await user.save();

            res.status(200).json({
                success: true,
                message: 'Password Reset successful. Please login to continue.',
            });
        } catch (error: any) {
            user.resetPasswordToken = undefined;
            user.resetTokenExpires = undefined;
            user.resetOtp = undefined;
            user.save();
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
