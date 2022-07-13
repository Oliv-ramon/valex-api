import { Router } from "express";

import * as cardController from "../controllers/cardController.js"
import apiKeyValidationMiddleware from "../middlewares/apiKeyValidationMiddleware.js";
import schemaValidationMiddleware from "../middlewares/schemaValidationMiddleware.js";
import activationDataSchema from "../schemas/activationDataSchema.js";
import blockingSchema from "../schemas/blockingSchema.js";
import cardSchema from "../schemas/cardSchema.js";
import virtualCardCreationSchema from "../schemas/virtualCardCreationSchema.js";
import virtualCardDeletionSchema from "../schemas/virtualCardDeletionSchema.js";

const cardRouter = Router();
cardRouter.post("/cards", schemaValidationMiddleware(cardSchema), apiKeyValidationMiddleware, cardController.create);
cardRouter.post("/cards/:originalCardId/virtuals", schemaValidationMiddleware(virtualCardCreationSchema), cardController.createVirtualCard);
cardRouter.delete("/cards/virtuals/:virtualCardId", schemaValidationMiddleware(virtualCardDeletionSchema), cardController.deleteVirtualCard);
cardRouter.patch("/cards/:cardId/activate", schemaValidationMiddleware(activationDataSchema), cardController.activate);
cardRouter.patch("/cards/:cardId/block", schemaValidationMiddleware(blockingSchema), cardController.block);
cardRouter.patch("/cards/:cardId/unblock", schemaValidationMiddleware(blockingSchema), cardController.unblock);

export default cardRouter;