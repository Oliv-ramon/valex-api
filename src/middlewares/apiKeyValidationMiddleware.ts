import { NextFunction, Request, Response } from "express";

import * as errors from "../utils/errorUtils.js"

export default function apiKeyValidationMiddleware(req: Request, res: Response, next: NextFunction) {
  const { "x-api-key": apiKey } = req.headers;

  if (!apiKey) {
    throw errors.unauthorized("unauthorized");
  }

  next();
}