export interface IUser extends Document {
    _id: string;
    name?: string;
    email: string;
    password: string;
    role: "admin" | "user";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    avatar?: ImageItem;
}


 type ImageItem = {
    asset_id: string;
    secure_url: string;
    url: string;
    public_id: string;
};