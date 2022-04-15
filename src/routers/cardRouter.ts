import { Router } from "express";

import * as cardController from "../controllers/cardController.js"
import apiKeyValidationMiddleware from "../middlewares/apiKeyValidationMiddleware.js";
import schemaValidationMiddleware from "../middlewares/schemaValidationMiddleware.js";
import cardSchema from "../schemas/cardSchema.js";

const cardRouter = Router();
cardRouter.post("/cards", schemaValidationMiddleware(cardSchema), apiKeyValidationMiddleware, cardController.create);

export default cardRouter;