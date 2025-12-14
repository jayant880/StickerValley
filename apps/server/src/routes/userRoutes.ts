import userController from "../controllers/userController";

const express = require("express");

const router = express.Router();

router.get("/me", userController.me);

export default router;
