import Joi from "joi";
import { emailSchema, passwordSchema ,nameSchema, nameSchemaOption, emailSchemaOption, passwordSchemaOption } from "./index";


// Admin login schema
const adminLoginSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
});

// Admin signup
const adminSignupSchema = Joi.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
});


const adminUpdateSchema = Joi.object({
    name: nameSchemaOption,
    email: emailSchemaOption,
    password: passwordSchemaOption,
});


export default{ 
    adminLoginSchema,
    adminSignupSchema,
    adminUpdateSchema,
 };
