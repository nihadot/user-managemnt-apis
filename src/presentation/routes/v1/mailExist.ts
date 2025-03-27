import express from "express";
import MailExistController from "@presentation/controllers/userMailExistController";
import asyncErrorHandler from "@presentation/middlewares/asyncErrorHandler";
import { authenticate } from "@presentation/middlewares/authMiddleware";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import userValidation from "@presentation/validation/userValidation";

const router = express.Router();


router.post("/", authenticate(["admin"]), validateRequest(userValidation.isExistMailSchema),asyncErrorHandler(MailExistController.isMailExist));
router.post("/same-user", authenticate(["admin"]), validateRequest(userValidation.isExistMailSchema),asyncErrorHandler(MailExistController.isSameUserMailExist));
router.post("/exist-mail", authenticate(["user"]), validateRequest(userValidation.isExistMailSchema),asyncErrorHandler(MailExistController.isMailExistUser));

export default router;
