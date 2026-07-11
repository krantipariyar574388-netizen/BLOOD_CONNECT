import express, { Request, Response } from "express";
import { errorHandler } from './middlewares/errorHandler.middleware';
import bloodRequestRoutes from './routes/bloodRequest.route';
import userRoutes from './routes/user.route';

const app = express();

app.use(express.json());

app.get("/",(req : Request, res : Response) => {
    res.status(200).json({
        message : "Server is up and running!!",
        status : "success",
        success : true,
        data : [],
    });
});

app.use('/bloodrequests', bloodRequestRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    const message = `Can not ${req.method} on ${req.path}`;

    const error : any =new Error(message);
    error.status = "fail";
    error.statusCode = 404;

    next(error);
});

//error handling middleware
app.use(errorHandler);

export default app;