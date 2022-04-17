import { NextFunction, Request, Response } from "express";

import * as errorUtils from "../utils/errorUtils.js"

export default async function apiKeyValidationMiddleware(req: Request, res: Response, next: NextFunction) {
  const { "x-api-key": apiKey } = req.headers;
  
  if (!apiKey) {
    throw errorUtils.unauthorizedError("unauthorized");
  }

  res.locals.apiKey = apiKey;

  next();
}