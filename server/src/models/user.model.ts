import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { Model, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password?: string;
    emailVerified: boolean;
    googleId?: string;
    githubId?: string;
    mobile?: string;
    resetPasswordToken?: string;
    resetTokenExpires?: Date;
    resetOtp?: string;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId && !this.githubId && !this.mobile;
            },
            select: false,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        googleId: {
            type: String,
        },
        githubId: {
            type: String,
        },
        mobile: {
            type: String,
        },
        resetPasswordToken: {
            type: String,
        },
        resetTokenExpires: {
            type: Date,
        },
        resetOtp: {
            type: String,
        },
    },
    { timestamps: true }
);

//sign Access Token
userSchema.methods.SignAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || '', {
        expiresIn: '5m',
    });
};

//sign Refresh Token
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || '', {
        expiresIn: '3d',
    });
};

//compare password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
