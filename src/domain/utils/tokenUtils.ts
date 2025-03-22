import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// JWT Access Token
export const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: "15m",
    });
};

// JWT Refresh Token
export const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: "7d",
    });
};

// Decoded payload if valid, else null
export const verifyToken = (token: string, secret: string): object | null => {
    try {
        return jwt.verify(token, secret) as object;
    } catch (error) {
        return null;
    }
};
