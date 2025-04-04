import { NextFunction, Request, Response } from "express";
import AdminService from "@application/useCases/adminService"; // Import AuthService
import { sanitizePayload } from "@presentation/middlewares/sanitizePayload";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken, verifyToken } from "@domain/utils/tokenUtils";
import AdminRepository from "@domain/repositories/AdminRepository";
import mongoose from "mongoose";

type Item = {
    name: string;
    password: string;
    avatar?: Image
    email:string
}
export type Image = {
    asset_id: string;
    secure_url: string;
    url: string;
    public_id: string;
};



const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const { accessToken, refreshToken , user } = await AdminService.login(email, password);

    res.cookie('adminAccessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax', // Protects against CSRF
        maxAge: 2 * 60 * 1000, // 15 minutes
    });

    res.cookie('adminRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true, data:user,accessToken:accessToken,refreshToken:refreshToken });
};

const signup = async (req: Request, res: Response): Promise<void> => {
    const data = sanitizePayload(req.body) as { email: string, password: string; name?: string, avatar?: Image };
    const signupResponse = await AdminService.signup(data);
    res.status(200).json({ success: true, data: signupResponse });
};

const getProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }
    const user = await AdminService.getProfile(req.user?.userId);
    res.status(200).json({ success: true, user: user });
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }

        const data = sanitizePayload(req.body) as Item;
    
    const user = await AdminService.updatedProfile(req.user?.userId,data);
    res.status(200).json({ success: true, data: user });
};

const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies['adminRefreshToken'];
    console.log(token,'[]')
    if (!token) {
        res.status(401).json({ success: false, message: "No refresh token provided" });
        return;
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as { userId: string; role: string };


    // console.log(decoded && decoded.role !== "admin",'---')
    if(decoded && decoded.role !== "admin"){
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }


    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
            throw new Error("Invalid ID or slug");
    }

    const isExistUser = await AdminRepository.findById(decoded.userId)
   
    // console.log(isExistUser,'isExistUser')
    if(!isExistUser){
  
        res.status(401).json({ success: false, message: "Unauthorized" });
  return;
    }
    
    const payload = { role: decoded.role, userId: decoded.userId };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie('adminAccessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2 * 60 * 1000, // 15 minutes
    });

    res.cookie('adminRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true,accessToken:accessToken,refreshToken:refreshToken });
return;
};

const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const token = req.cookies.adminAccessToken;


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

    console.log(req.cookies,'000')

    // res.cookie('adminAccessToken', '', {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'lax',
    //     maxAge: 2 * 60 * 1000, // 15 minutes
    // });

    // res.cookie('adminRefreshToken', '', {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'lax',
    //     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    res.clearCookie("adminAccessToken")
    res.clearCookie("adminRefreshToken")


    res.status(200).json({ message: "Logout successful" });
}


const profile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }

    console.log(req.user,'000')
    
    const user = await AdminService.fetchProfile(req.user?.userId);
    res.status(200).json({ success: true, data: user });
};
export default {
    login,
    signup,
    getProfile,
    refreshToken,
    protectRoute,
    logout,
    updateProfile,
    profile
}