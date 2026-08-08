import nodemailer from "nodemailer";
import ENV_CONFIG from "../config/env.config";

const transporter = nodemailer.createTransport({
    host : ENV_CONFIG.SMTP_HOST,
    port : Number(ENV_CONFIG.SMTP_PORT),
    secure : false,
    auth : {
        user : ENV_CONFIG.SMTP_USER,
        pass : ENV_CONFIG.SMTP_PASS,
    },
});

export const sendResetPasswordEmail = async (to : string, resetUrl : string) => {
    try {
        await transporter.sendMail({
            from : `"Blood Connect" <${ENV_CONFIG.SMTP_USER}>`,
            to,
            subject : "Reset your password",
            html: `
            <p>You requested a password reset.</p>
            <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>If you didn't request this, ignore this email.</p>`, 
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send reset email");
    }
};