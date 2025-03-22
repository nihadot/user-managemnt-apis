import UserModel from "@domain/models/User";
import { IUser } from "@domain/interfaces/IUser";

const findById = async (id: string): Promise<IUser | null> => {
    return await UserModel.findById(id);
};

const findByEmail = async (email: string): Promise<IUser | null> => {
    return await UserModel.findOne({ email });
};

const create = async (userData: Partial<IUser>): Promise<IUser> => {
    const user = new UserModel(userData);
    return await user.save();
};

const findByIdAndUpdate = async (id: string, updates: Partial<IUser>): Promise<IUser | null> => {
    return await UserModel.findByIdAndUpdate(id, updates, { new: true });
};

const deleteById = async (id: string): Promise<void> => {
    await UserModel.findByIdAndDelete(id);
};

export default {
    findById,
    findByEmail,
    create,
    findByIdAndUpdate,
    deleteById,
};
