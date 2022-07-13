import { Router } from "express";

import * as transactionController from "../controllers/transactionController.js"
import apiKeyValidationMiddleware from "../middlewares/apiKeyValidationMiddleware.js";
import schemaValidationMiddleware from "../middlewares/schemaValidationMiddleware.js";
import purchasePayloadSchema from "../schemas/purchasePayloadSchema.js";
import onlinePurchasePayloadSchema from "../schemas/onlinePurchasePayloadSchema.js";
import rechargeSchema from "../schemas/rechargeSchema.js";

const transactionRouter = Router();
transactionRouter.get("/transactions/:cardId/balance", transactionController.getStatement);
transactionRouter.post("/transactions/:cardId/recharge", apiKeyValidationMiddleware, schemaValidationMiddleware(rechargeSchema), transactionController.createRecharge);
transactionRouter.post("/transactions/:cardId/purchase/:businessId", schemaValidationMiddleware(purchasePayloadSchema), transactionController.CreatePurchase);
transactionRouter.post("/transactions/purchase/online/:businessId", schemaValidationMiddleware(onlinePurchasePayloadSchema), transactionController.createOnlinePurchase);

export default transactionRouter;