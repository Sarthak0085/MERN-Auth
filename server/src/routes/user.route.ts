import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import { updateAccessToken } from '../controllers/auth.controller.js';
import { getUser, getUserInfoById } from '../controllers/user.controller.js';

const userRouter = Router();

//GET USER INFO
userRouter.get('/me', isAuthenticated, updateAccessToken, getUser);

// USER DETAILS
userRouter.get('/:id', isAuthenticated, updateAccessToken, getUserInfoById);

export default userRouter;
