import { Request, Response } from "express";
import MailExistService from "@application/useCases/mailExistService";
import { sanitizePayload } from "@presentation/middlewares/sanitizePayload";


export type Image = {
    asset_id: string;
    secure_url: string;
    url: string;
    public_id: string;
};




const isMailExist = async (req: Request, res: Response): Promise<void> => {
    const data = sanitizePayload(req.body) as { email: string };
    await MailExistService.isMailExist(data.email,req.user?.userId as string);
    res.status(200).json({ success: true, });
};



const isSameUserMailExist = async (req: Request, res: Response): Promise<void> => {
    const data = sanitizePayload(req.body) as { email: string };
    await MailExistService.isSameUserMailExist(data.email,req.user?.userId as string);
    res.status(200).json({ success: true, });
};


const isMailExistUser = async (req: Request, res: Response): Promise<void> => {
    const data = sanitizePayload(req.body) as { email: string };
    await MailExistService.isSameUserMailExist(data.email,req.user?.userId as string);
    res.status(200).json({ success: true, });
};





export default {
    isMailExist,
    isSameUserMailExist,
    isMailExistUser
}