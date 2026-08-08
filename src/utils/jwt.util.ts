import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserRole } from "../@types/enum.types";
import ENV_CONFIG from "../config/env.config";

export interface IJwtPayload {
    _id : mongoose.Types.ObjectId | string;
    email : string;
    role : UserRole;
}

export interface IJwtReturn extends IJwtPayload {
    iat : number;
    exp : number;
}

export const generateJwtToken = (payload : IJwtPayload) : string => {
    try {
        return jwt.sign(payload, ENV_CONFIG.JWT_SECRET as string, {
            expiresIn : ENV_CONFIG.JWT_EXPIRES_IN as any,
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to generate token");
    }
}

export const verifyToken = (token : string) : IJwtReturn | null => {
    try {
        return jwt.verify(token, ENV_CONFIG.JWT_SECRET as string) as IJwtReturn;
    } catch (error) {
        console.log(error);
        return null;
    }
};