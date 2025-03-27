import express from "express";
import AdminController from "@presentation/controllers/adminController";
import { validateRequest } from "@presentation/middlewares/validateRequest";
import AdminValidate from "@presentation/validation/adminValidation";
import asyncErrorHandler from "@presentation/middlewares/asyncErrorHandler";
import { authenticate } from "@presentation/middlewares/authMiddleware";

const router = express.Router();


router.post("/login", validateRequest(AdminValidate.adminLoginSchema), asyncErrorHandler(AdminController.login));

router.post("/signup", validateRequest(AdminValidate.adminSignupSchema), asyncErrorHandler(AdminController.signup));

router.get("/profile", authenticate(["admin"]), asyncErrorHandler(AdminController.getProfile));

router.put("/profile", validateRequest(AdminValidate.adminUpdateSchema), authenticate(["admin"]), asyncErrorHandler(AdminController.updateProfile));

// router.put("/protect-route", validateRequest(AdminValidate.adminUpdateSchema), authenticate(["admin"]), asyncErrorHandler(AdminController.updateProfile));

router.get('/refresh-token', asyncErrorHandler(AdminController.refreshToken))

router.get('/protect-route', asyncErrorHandler(AdminController.protectRoute))

router.get('/profile', asyncErrorHandler(AdminController.protectRoute))

router.get('/logout', authenticate(["admin"]), asyncErrorHandler(AdminController.logout))

router.get('/me', authenticate(["admin"]), asyncErrorHandler(AdminController.profile))

router.put('/me', authenticate(["admin"]), asyncErrorHandler(AdminController.updateProfile))

export default router;
