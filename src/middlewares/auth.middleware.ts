import { Request, Response, NextFunction } from "express";
import { UserRole } from "../@types/enum.types";
import { AppError } from "../utils/customError.util";
import { verifyToken } from "../utils/jwt.util";

export interface AuthRequest extends Request {
    user? : {
        _id : string;
        emmail : string;
        role : UserRole;
    };
}

export const authentication = (role?: UserRole[]) => {
    return (req : AuthRequest, res : Response, next : NextFunction) =>{
        try {
            const cookies= req.cookies;
            const access_token = cookies?.["access_token"];

            if(!access_token) {
                throw new AppError("Unauthorized. Access denied!!", 401);
            }

            if (roles && !removeEventListener.includes(decoded_date.role)) {
                throw new AppError("Forbidden. You cannot access this resource!!", 403);
            }

            req.user = {
                _id : decoded_data._id || decoded_data.id,
                email : decoded_data.email,
                role : decoded_data.role,
            };
            next();
        } catch (error) {
            next(error);
        }
    };
};