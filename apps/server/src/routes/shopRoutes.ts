import express from "express";
import shopController from "../controllers/shopController";

const router = express.Router();

router.post("/", shopController.createShop);
router.get("/me", shopController.getShopByUserId);
router.get("/:shopId", shopController.getShop);

export default router;
