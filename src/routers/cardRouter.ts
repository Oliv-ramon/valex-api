import { Router } from "express";

import * as cardController from "../controllers/cardController.js"
import apiKeyValidationMiddleware from "../middlewares/apiKeyValidationMiddleware.js";
import schemaValidationMiddleware from "../middlewares/schemaValidationMiddleware.js";
import activationDataSchema from "../schemas/activationDataSchema.js";
import blockingSchema from "../schemas/blockingSchema.js";
import cardSchema from "../schemas/cardSchema.js";
import purchasePayloadSchema from "../schemas/purchasePayloadSchema.js";
import rechargeSchema from "../schemas/rechargeSchema.js";

const cardRouter = Router();
cardRouter.get("/cards/:cardId/statement", cardController.getStatement);
cardRouter.post("/cards", schemaValidationMiddleware(cardSchema), apiKeyValidationMiddleware, cardController.create);
cardRouter.patch("/cards/:cardId/activate", schemaValidationMiddleware(activationDataSchema), cardController.activate);
cardRouter.post("/cards/:cardId/recharge", apiKeyValidationMiddleware, schemaValidationMiddleware(rechargeSchema), cardController.recharge);
cardRouter.post("/cards/:cardId/purchase/:businessId", schemaValidationMiddleware(purchasePayloadSchema), cardController.purchase);
cardRouter.patch("/cards/:cardId/block", schemaValidationMiddleware(blockingSchema), cardController.block);
cardRouter.patch("/cards/:cardId/unblock", schemaValidationMiddleware(blockingSchema), cardController.unblock);

export default cardRouter;