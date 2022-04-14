import { Router } from "express";

import * as cardController from "../controllers/cardController.js"
import apiKeyValidationMiddleware from "../middlewares/apiKeyValidationMiddleware.js";

const cardRouter = Router();
cardRouter.post("/cards", apiKeyValidationMiddleware, cardController.create);

export default cardRouter;