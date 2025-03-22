
import bcrypt from "bcryptjs";
import AdminRepository from "@domain/repositories/AdminRepository";
import { IUser } from "@domain/interfaces/IUser";
import { hashPassword } from "@domain/utils/passwordUtils";
import { generateAccessToken, generateRefreshToken } from "@domain/utils/tokenUtils";


type Item = {
    name?: string;
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


type EditItem = {
    email?: string, password: string, name?: string, avatar?: Image
}

const login = async (email: string, password: string) => {
    const user = await AdminRepository.findByEmail(email);
    if (!user) {
        throw new Error("Invalid credentials");
    }
  

    if(!user.password){
        throw new Error("Invalid credentials");
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const payload = { role: user.role, userId: user._id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    if (!accessToken || !refreshToken) {
        throw new Error("Failed to generate token");
    }

    return { accessToken, refreshToken , user:{
        name:user.name,
        email:user.email,
        avatar:user.avatar,
    } };
};


const signup = async (item: Item) => {
    const user = await AdminRepository.findByEmail(item.email);
    if (user) {
        throw new Error("Mail already exists");
    }

    const hashedPassword = await hashPassword(item.password);

    if (!hashedPassword) {
        throw new Error("Failed to hash password");
    }

    const newAdmin: Partial<IUser> = {
        email: item.email,
        password: hashedPassword,
        role: "admin"
    };
    if (item.name) newAdmin.name = item.name;

    if (item.avatar) newAdmin.avatar = item.avatar;

    const createdAdmin = await AdminRepository.create(newAdmin);

    const { name, email, avatar } = createdAdmin

    const data = { name, email, avatar }
    return data;
};

const getProfile = async (userId: string) => {
    const user = await AdminRepository.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }
    return {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    };

};


const updatedProfile = async (userId: string, data: EditItem) => {
    let updatedData = { ...data }; // Copy data to avoid mutation

    if (updatedData.password) {
        const hashedPassword = await hashPassword(updatedData.password);
        
        if (!hashedPassword) {
            throw new Error("Failed to hash password");
        }
        
        updatedData.password = hashedPassword;
    }

    const user = await AdminRepository.findByIdAndUpdate(userId, updatedData);

    if (!user) {
        throw new Error("User not found");
    }

    return {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    };
};



export default {
    login,
    signup,
    getProfile,
    updatedProfile,
};
