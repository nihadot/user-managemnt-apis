import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "@domain/interfaces/IUser";

const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "admin"
        },
        avatar: {
            type: Object,
            default: ""
        }
    },
    { timestamps: true }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
