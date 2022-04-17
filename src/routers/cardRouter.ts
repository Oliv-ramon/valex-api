import { Router } from "express";

import * as cardController from "../controllers/cardController.js"
import apiKeyValidationMiddleware from "../middlewares/apiKeyValidationMiddleware.js";
import schemaValidationMiddleware from "../middlewares/schemaValidationMiddleware.js";
import activationDataSchema from "../schemas/activationDataSchema.js";
import cardSchema from "../schemas/cardSchema.js";
import rechargeSchema from "../schemas/rechargeSchema.js";

const cardRouter = Router();
cardRouter.post("/cards", schemaValidationMiddleware(cardSchema), apiKeyValidationMiddleware, cardController.create);
cardRouter.post("/cards/:cardId/activate", schemaValidationMiddleware(activationDataSchema), cardController.activate);
cardRouter.post("/cards/:cardId/recharge", apiKeyValidationMiddleware, schemaValidationMiddleware(rechargeSchema), cardController.recharge);

export default cardRouter;