import express from "express";
import shopController from "../controllers/shopController";
import { requireShopByShopId, requireShopByUserId } from "../middleware/shopMiddleware";
import { requireUser } from "../middleware/userMiddleware";
import { validate } from "../middleware/validationMiddleware";
import { createShopSchema, updateShopSchema } from "../validationSchema/shop.schema";

const router = express.Router();

router.post("/", requireUser, validate(createShopSchema), shopController.createShop);
router.put("/", requireUser, requireShopByUserId, validate(updateShopSchema), shopController.updateShop);
router.get("/me", requireUser, requireShopByUserId, shopController.getShopByUserId);
router.get("/:shopId", requireShopByShopId, shopController.getShop);

export default router;
