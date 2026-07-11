import express, { Request, Response } from "express";
// import { errorHandling } from './middleware/errorHandler.middleware';
import bloodRequestRoutes from './routes/bloodRequest.route';

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

export default app;