import userController from "../controllers/userController";

const express = require("express");

const router = express.Router();

router.get("/me", userController.me);
router.get("/:userId", userController.getUserById);
router.put("/me", userController.updateMe);

export default router;
