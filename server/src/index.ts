import express, { Request, Response } from 'express';
import cors from 'cors';
import CookieParser from 'cookie-parser';
import 'dotenv/config';

import connectDB from './config/db.js';
import router from './routes/index.js';
import { ErrorMiddleware } from './middleware/error.js';

const app = express();
const port = process.env.PORT || 4000;

connectDB();

const allowedOrigins = [process.env.FRONTEND_URL!, 'http://localhost:5173'];

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// API Routes
app.get('/', (req: Request, res: Response) => {
    res.send(`Server is running finee.`);
});
app.use('/api/v1', router);

// Custom Error
app.use(ErrorMiddleware);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
