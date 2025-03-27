import Joi from "joi";

const emailSchema = Joi.string().email().trim().lowercase().required();

const passwordSchema = Joi.string()
    .min(8)
    .max(30)
    .pattern( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$#!%*?&]{8,30}$/)
    .required()
    .messages({
        "string.pattern.base": "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password must be at most 30 characters long."
    });


const nameSchema = Joi.string().trim().required()


const emailSchemaOption = Joi.string().email().trim().lowercase().optional();
const passwordSchemaOption = Joi.string()
    .min(8)
    .max(30)
    .pattern( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$#!%*?&]{8,30}$/)
    .optional()
    .messages({
        "string.pattern.base": "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password must be at most 30 characters long."
    });
const nameSchemaOption = Joi.string().trim().optional()






const imageSchemaOption = Joi.object().optional();



export {
    emailSchema,
    passwordSchema,
    nameSchema,
    emailSchemaOption,
    nameSchemaOption,
    passwordSchemaOption,
    imageSchemaOption,
};
