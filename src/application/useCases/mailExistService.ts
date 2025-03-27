
import UserRepository from "@domain/repositories/UserRepository";



const isMailExist = async (email: string,userID:string) => {

    const user = await UserRepository.findByEmail(email);

    if (user &&  userID !== user._id  ) {
        throw new Error("Mail is Exist");
    }

    return {
        status: true,
    }
};



const isSameUserMailExist = async (email: string,id:string) => {
    

    const user = await UserRepository.findByEmail(email);



    if (user && user._id.toString() !== id.toString()) {
        throw new Error("Mail is Exist");
    }

    return {
        status: true,
    }
};


export default {
    isMailExist,
    isSameUserMailExist
};
