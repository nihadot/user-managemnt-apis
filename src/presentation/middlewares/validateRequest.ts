import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

// Middleware for request validation
export const validateRequest = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            res.status(400).json({ 
                success: false, 
                message: "Validation failed",
                errors: error.details.map(err => err.message),
            });
            return;
        }

        next();
    };
};
