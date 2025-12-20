import express from "express";
import userController from "../controllers/userController";
import { requireUser } from "../middleware/userMiddleware";

const router = express.Router();

router.get("/me", requireUser, userController.me);
router.get("/:userId", userController.getUserById);
router.put("/me", requireUser, userController.updateMe);

export default router;
