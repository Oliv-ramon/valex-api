import { NextFunction, Request, Response } from "express";

import * as errors from "../utils/errorUtils.js"

export default async function apiKeyValidationMiddleware(req: Request, res: Response, next: NextFunction) {
  const { "x-api-key": apiKey } = req.headers;
  console.log(apiKey)
  if (!apiKey) {
    throw errors.unauthorized("unauthorized");
  }

  res.locals.apiKey = apiKey;

  next();
}