import { Router } from 'express';
import authRouter from './auth.route.js';
import userRouter from './user.route.js';

const router = Router();

/********** AUTH ROUTES **********/
router.use('/auth', authRouter);

/********** USER ROUTES *********/
router.use('/user', userRouter);

export default router;
