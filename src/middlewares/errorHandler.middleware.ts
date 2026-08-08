import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const message = error?.message ?? "Something went wrong!";
    const status = error?.statusCode ? "fail" : "error";
    const statusCode = error?.statusCode ?? 500;

    console.log(error);

    res.status(statusCode).json({
        message,
        status,
        success: false,
        data: null,
        stack: error?.stack,
    });
}