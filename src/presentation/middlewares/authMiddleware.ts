import UserRepository from "@domain/repositories/UserRepository";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type Status = "admin" | "user" ;

export const authenticate = (allowedRoles: Status[]) => {
    return (req: Request, res: Response, next: NextFunction):void => {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.accessToken; // Check token in cookies

        // Extract token from either Authorization header or cookies
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : cookieToken;
        

        console.log(token,'toke')

        if (!token) {
            res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { role: Status, userId: string };

            console.log(decoded,'token')
            if (!decoded || !decoded.role) {
                res.status(401).json({ success: false, message: "Invalid authentication" });
                return;
            }

            // Check if the user has a valid role
            if (!allowedRoles.includes(decoded.role as Status)) {
                 res.status(403).json({ success: false, message: "Access denied: Insufficient permissions" });
                return
                }

                const isExistUser = UserRepository.findById(decoded.userId);
                if (!isExistUser) {
                    res.status(401).json({ success: false, message: "Invalid authentication" });
                    return;
                    }
      
            req.user = decoded

            next(); // Proceed to next middleware or route
        } catch (error: any) {
            res.status(403).json({ success: false, message: process.env.NODE_ENV === 'production' ? '"Invalid or expired token"' : error.message || 'Invalid or expired token' });
        }
    };
};
