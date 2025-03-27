import express from "express";
import UserController from "@presentation/controllers/userController"; // Import named function
import { validateRequest } from "@presentation/middlewares/validateRequest";
import UsersValidate from "@presentation/validation/userValidation";
import asyncErrorHandler from "@presentation/middlewares/asyncErrorHandler";
import { authenticate } from "@presentation/middlewares/authMiddleware";

const router = express.Router();


router.post("/", authenticate(["admin"]), validateRequest(UsersValidate.userCreateSchema), asyncErrorHandler(UserController.createUser));

router.get("/", authenticate(["admin"]), asyncErrorHandler(UserController.getAllUsers));
router.get("/me",authenticate(["user"]),asyncErrorHandler(UserController.getUserProfile))

router.get("/:id", authenticate(["admin"]), asyncErrorHandler(UserController.getUserById));

router.delete("/:id", authenticate(["admin"]), asyncErrorHandler(UserController.deleteUser));

router.put("/me",authenticate(["user"]),validateRequest(UsersValidate.isProfileUserUpdateSchema),asyncErrorHandler(UserController.updateProfile))
router.put("/:id",authenticate(["admin"]),validateRequest(UsersValidate.userUpdateSchema),asyncErrorHandler(UserController.updateExistingUser))

export default router;



