import { Request, Response } from "express";
import UserService from "@application/useCases/userService";
import { sanitizePayload } from "@presentation/middlewares/sanitizePayload";
import mongoose from "mongoose";
import { Status } from "@presentation/middlewares/authMiddleware";

export type DeleteSorting = "soft" | "not-soft" | 'both';



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


const createUser = async (req: Request, res: Response): Promise<void> => {
    const data = sanitizePayload(req.body) as Item;
    const createdUser = await UserService.createUser(data);
   
    const createdUserData = {
        name:data.name,
        email:data.email,
        avatar:data.avatar,
    }
    res.status(201).json({ success: true, data:createdUserData });
};

const getAllUsers = async (req: Request, res: Response): Promise<void> => {

    const {
        page = 1,
        limit = 20,
        search = "",
        sortBy = "createdAt",
        sortOrder = "desc",
    } = req.query as Partial<{ page: number, limit: number, search: string, sortBy: string, sortOrder: string }>;


    const userRole: Status = req.user?.role as Status;

    console.log(userRole)

    const result = await UserService.getAllUsers({
        page: Number(page),
        limit: Number(limit),
        search,
        sortBy,
        sortOrder: sortOrder === "desc" ? -1 : 1,
        userRole,
    });

    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: result.items,
        pagination: {
            currentPage: Number(page),
            perPage: Number(limit),
            totalRecords: result.totalRecords,
            totalPages: Math.ceil(result.totalRecords / Number(limit)),
        },
    });
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID or slug");
    }

    let result = await UserService.getUserById(id);


    if (!result) {
        throw new Error("User not found");
    }



    const data = {
        name: result?.name,
        email: result?.email,
        avatar: result?.avatar,
    }

    res.status(200).json({ success: true, data });
};

const updateExistingUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID or slug");
    }

    const data = sanitizePayload(req.body) as Item;

    let result = await UserService.updateUser(id, data);
   

    const responseData = {
        name: result?.name,
        _id: result?._id,
        avatar: result?.avatar,
        email: result?.email,

    }
    res.status(200).json({ success: true, data: responseData });
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID");
    }

    if(req.user && req.user.userId.toString() === id.toString()){
        throw new Error("You cannot delete your own account");
    }
    const result = await UserService.deletedUser(id);
    res.status(200).json({ success: true, message: 'Successfully deleted ' });
};



const getUserProfile = async (req: Request, res: Response): Promise<void> => {
   
    if (!req.user || !req.user.userId) {
        throw new Error("User not found");
    }
    

    const result = await UserService.getUserById(req.user.userId as string);
     res.status(200).json({ success: true, data: result });
    

};





const updateProfile = async (req: Request, res: Response): Promise<void> => {
   
    if(!req.user || !req.user.userId){
        throw new Error("User not found");
    }


            const data = sanitizePayload(req.body) as any;
    
    const id = req.user?.userId

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID");
    }
    const result = await UserService.updateProfile(id,data);
    res.status(200).json({ success: true, message: 'Successfully updated ' });
};


export default {
    createUser,
    getAllUsers,
    getUserById,
    updateExistingUser,
   deleteUser ,
   getUserProfile,
   updateProfile,
    // getAllAgencyNames,
};
