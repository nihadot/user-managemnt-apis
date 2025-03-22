import express from "express";
import UserController from "@presentation/controllers/userController"; // Import named function
import { validateRequest } from "@presentation/middlewares/validateRequest";
import UsersValidate from "@presentation/validation/userValidation";
import asyncErrorHandler from "@presentation/middlewares/asyncErrorHandler";
import { authenticate } from "@presentation/middlewares/authMiddleware";

const router = express.Router();


router.post("/", authenticate(["admin"]), validateRequest(UsersValidate.userCreateSchema), asyncErrorHandler(UserController.createUser));

router.get("/", authenticate(["admin"]), asyncErrorHandler(UserController.getAllUsers));

router.get("/:id", authenticate(["user","admin"]), asyncErrorHandler(UserController.getUserById));

router.delete("/:id", authenticate(["admin"]), asyncErrorHandler(UserController.deleteUser));

router.put("/:id",authenticate(["admin"]),validateRequest(UsersValidate.userUpdateSchema),asyncErrorHandler(UserController.updateExistingUser))

export default router;
