import {Request, Response, NextFunction } from "express";
// import { sendResponse } from "../utils/sendResponse.utils";

export const errorHandler = (
    error : any,
    req : Request,
    res : Response,
    next : NextFunction
) => {
    const message = error?.status ?? "Something went wrong!";
    const status = error?.status ?? "error";
    const statusCode = error?.statusCode ?? 500;

    console.log(error);

    res.status(statusCode).json({
        message,
        status,
        success : false,
        data : null,
        stack : error?.stack,
    });
}

// sendResponse(res, {
//     message,
//         status,
//         success : false,
//         data : null,
//         stack : error?.stack,
// })