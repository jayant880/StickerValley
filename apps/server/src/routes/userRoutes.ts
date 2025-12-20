import express from "express";
import userController from "../controllers/userController";
import { requireUser } from "../middleware/userMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { updateUserSchema } from "../validationSchema/user.schema";

const router = express.Router();

router.get("/me", requireUser, userController.me);
router.get("/:userId", userController.getUserById);
router.put("/me", requireUser, validate(updateUserSchema), userController.updateMe);

export default router;
