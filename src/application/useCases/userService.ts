
import bcrypt from "bcryptjs";
import UserRepository from "@domain/repositories/UserRepository";
import { IUser } from "@domain/interfaces/IUser";
import { hashPassword } from "@domain/utils/passwordUtils";
import { generateAccessToken, generateRefreshToken } from "@domain/utils/tokenUtils";
import slugify from "slugify";


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


type EditItem = {
    email: string, password?: string, name: string, avatar?: string
}

const login = async (email: string, password: string) => {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
        throw new Error("Invalid credentials");
    }

    console.log('[User]:',user)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    if(user.role === "admin"){
        throw new Error("Cant't login with this account")
    }


    const payload = { role: user.role, userId: user._id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    if (!accessToken || !refreshToken) {
        throw new Error("Failed to generate token");
    }

    return {
        accessToken, refreshToken, user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        }
    };
};


const signup = async (item: Item) => {
    const user = await UserRepository.findByEmail(item.email);
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
        role: "user"
    };
    if (item.name) newAdmin.name = item.name;

    if (item.avatar) newAdmin.avatar = item.avatar;

    const createdAdmin = await UserRepository.create(newAdmin);

    const { name, email, avatar } = createdAdmin

    const data = { name, email, avatar }
    return data;
};

const getProfile = async (userId: string) => {
    const user = await UserRepository.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }
    return {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    };

};


const updatedProfile = async (userId: string, data: {
    email: string;
    password?: string;
    name: string;
    avatar?: Image;
}) => {



    let updatedData = { ...data };

    if (updatedData.email) {
        const user = await UserRepository.findByEmail(updatedData.email);

        if (user && user._id.toString() !== userId) {
            throw new Error("Email already exists");
        }
    }

    if (updatedData.password) {
        const hashedPassword = await hashPassword(updatedData.password);

        if (!hashedPassword) {
            throw new Error("Failed to hash password");
        }

        updatedData.password = hashedPassword;
    }

    const user = await UserRepository.findByIdAndUpdate(userId, updatedData);

    if (!user) {
        throw new Error("User not found");
    }

    return {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    };
};



const createUser = async (data: Item) => {


    

    const isUserExist = await UserRepository.findByEmail(data.email);

    if (isUserExist) {
       
            throw new Error("Mail ID is already in use");
    }


    if (data.password) {
        const hashedPassword = await hashPassword(data.password);
        
        if (!hashedPassword) {
            throw new Error("Failed to hash password");
        }
        
        data.password = hashedPassword;
    }



    const user = await UserRepository.create({ ...data,role:"user" });


    return { user };
};




const getUserById = async (id: string) => {
    const user = await UserRepository.findById(id);
 

    if (!user) {
        throw new Error("User not found");
    }

    const data = {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
    }

    return data;
};


type IGetAllUsers = {
    page: number;
    limit: number;
    search?: string | undefined;
    sortBy: string | 'name';
    sortOrder: number | undefined;
    userRole?: 'admin' | 'user';
}


const getAllUsers = async ({ page, limit, sortBy, sortOrder, search }: IGetAllUsers) => {
    const offset = (page - 1) * limit;


    let items = [];
    let totalRecords = 0;

    if (search) {

        items = await UserRepository.aggregate([
            { $match: {  name: search } },
            { 
                $sort: { [sortBy]: sortOrder } 
            },
            { 
                $skip: offset 
            },
            { 
                $limit: limit 
            },
            {
                $project: { 
                    _id: 1, 
                    name: 1, 
                    avatar: 1, 
                    email:1,
                }
            }
          
        ]);

        totalRecords = await UserRepository.count({ name: search });

        // **Step 2: If no exact match, find similar matches**
        if (items.length === 0) {
            items = await UserRepository.aggregate([
                { $match: { name: { $regex: search, $options: "i" } } },

                { 
                    $sort: { [sortBy]: sortOrder } 
                },
                { 
                    $skip: offset 
                },
                { 
                    $limit: limit 
                },
                {
                    $project: { 
                        _id: 1, 
                        name: 1, 
                        avatar: 1, 
                        email:1,
                    }
                }
            ]);

            totalRecords = await UserRepository.count({ name: { $regex: search, $options: "i" } });
        }
    } else {
        // No search query, return normal paginated results
        items = await UserRepository.aggregate([
            { 
                $sort: { [sortBy]: sortOrder } 
            },
            { 
                $skip: offset 
            },
            { 
                $limit: limit 
            },
            {
                $project: { 
                    _id: 1, 
                    name: 1, 
                    avatar: 1, 
                    email:1,
                }
            }
          
        ]);

        totalRecords = await UserRepository.count();
    }
    return { items, totalRecords };
};




const updateUser= async (id: string, data: {email?:string,password?:string,avatar?:Image;name?:string}) => {

    const isExist = await UserRepository.findById(id);

    if (!isExist) {    
        throw new Error("User not found");
    }
    
    let updatedData = { ...data }; // Create a copy of data
    
    console.log(updatedData,'pre')
    
    if (updatedData.password) {
        const hashedPassword = await hashPassword(updatedData.password);
        
        if (!hashedPassword) {
            throw new Error("Failed to hash password");
        }
        
        updatedData.password = hashedPassword; // Ensure the password is hashed before updating
    }

    console.log(updatedData,'post')
    
    const updatedUser = await UserRepository.findByIdAndUpdate(id, updatedData);
    
    return updatedUser;
    
};




const deletedUser= async (id: string) => {

    const isExist = await UserRepository.findById(id);
    if (!isExist) {    
        throw new Error("User not found");
    }
    
   
    const deletedUser = await UserRepository.deleteById(id);
    
    return deletedUser;
    
};


const updateProfile = async (userId: string, data: any) => {
    let updatedData = { ...data }; // Copy data to avoid mutation

    console.log('[updatedData]',updatedData)

    if (updatedData.password) {
        const hashedPassword = await hashPassword(updatedData.password);
        
        if (!hashedPassword) {
            throw new Error("Failed to hash password");
        }
        
        updatedData.password = hashedPassword;
    }

    const user = await UserRepository.findByIdAndUpdate(userId, updatedData);

    if (!user) {
        throw new Error("User not found");
    }


    console.log('[user]',user);

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
    createUser,
    getUserById,
    getAllUsers,
    updateUser,
    deletedUser,
    updateProfile
};
