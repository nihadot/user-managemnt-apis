import express from "express";
import UserController from "@presentation/controllers/userAuthController";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import UserValidate from "@presentation/validation/userValidation";
import asyncErrorHandler from "@presentation/middlewares/asyncErrorHandler";
import { authenticate } from "@presentation/middlewares/authMiddleware";

const router = express.Router();


router.post("/login", validateRequest(UserValidate.userLoginSchema), asyncErrorHandler(UserController.login));

router.post("/signup", validateRequest(UserValidate.userSignupSchema), asyncErrorHandler(UserController.signup));

router.get("/profile", authenticate(["user"]), asyncErrorHandler(UserController.getProfile));

router.put("/profile", authenticate(["user"]), asyncErrorHandler(UserController.updateProfile));

router.post('/refresh-token', asyncErrorHandler(UserController.refreshToken))

router.get('/protect-route', asyncErrorHandler(UserController.protectRoute))

router.post('/logout', authenticate(["user"]), asyncErrorHandler(UserController.logout))
export default router;
