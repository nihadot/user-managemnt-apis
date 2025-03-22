import Joi from "joi";
import { emailSchema, emailSchemaOption, nameSchema, nameSchemaOption, passwordSchema, passwordSchemaOption ,imageSchemaOption} from "./index";


// Admin login schema
const userLoginSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
});

// Admin signup
const userSignupSchema = Joi.object({
    name: Joi.string().trim().optional(),
    email: emailSchema,
    password: passwordSchema,
});


const userUpdateSchema = Joi.object({
    name: nameSchemaOption,
    email: emailSchemaOption,
    password: passwordSchemaOption,
});


const userCreateSchema = Joi.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    avatar: imageSchemaOption
});



export default{ 
    userLoginSchema,
    userSignupSchema,
    userUpdateSchema,
    userCreateSchema,
 };
