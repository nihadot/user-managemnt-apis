import { NextFunction, Request, Response } from "express";
import UserService from "@application/useCases/userService"; // Import AuthService
import { sanitizePayload } from "@presentation/middlewares/sanitizePayload";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, verifyToken } from "@domain/utils/tokenUtils";


export type Image = {
    asset_id: string;
    secure_url: string;
    url: string;
    public_id: string;
};



const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await UserService.login(email, password);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax', // Protects against CSRF
        maxAge: 2 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, data: user,refreshToken:refreshToken,accessToken:accessToken  });
};

const signup = async (req: Request, res: Response): Promise<void> => {
    const data = sanitizePayload(req.body) as { email: string, password: string; name: string, avatar?: Image };
    const signupResponse = await UserService.signup(data);
    res.status(200).json({ success: true, data: signupResponse });
};

const getProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }
    const user = await UserService.getProfile(req.user?.userId);
    res.status(200).json({ success: true, user: user });
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }

    const data = sanitizePayload(req.body) as {
        email: string;
        password: string;
        name: string;
        avatar?: Image;
    };

    const user = await UserService.updatedProfile(req.user?.userId, data);
    res.status(200).json({ success: true, data: user });
};

const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.refreshToken;

    if (!token) {
        res.status(401).json({ success: false, message: "No refresh token provided" });
        return;
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as { userId: string; role: string };

    if(decoded && decoded.role !== "user"){
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
    

    const payload = { role: decoded.role, userId: decoded.userId };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true });

};

const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const token = req.cookies.accessToken;

    if (!token) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }

    // Validate token and attach user to request
    const user = verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string) as { userId: string; role: string };

    if (!user) {
        res.status(403).json({ success: false, message: "Forbidden" });
        return;
    }

    res.status(200).json({ success: true, message: "logged successful" });


};


const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    res.cookie('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    res.status(200).json({ message: "Logout successful" });
}

export default {
    login,
    signup,
    getProfile,
    refreshToken,
    protectRoute,
    logout,
    updateProfile
}