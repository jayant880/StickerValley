import express from "express";
import shopController from "../controllers/shopController";
import { requireShopByShopId, requireShopByUserId } from "../middleware/shopMiddleware";
import { requireUser } from "../middleware/userMiddleware";

const router = express.Router();

router.post("/", requireUser, shopController.createShop);
router.get("/me", requireUser, requireShopByUserId, shopController.getShopByUserId);
router.get("/:shopId", requireShopByShopId, shopController.getShop);

export default router;
