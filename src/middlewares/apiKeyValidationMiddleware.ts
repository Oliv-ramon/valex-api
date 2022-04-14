import { NextFunction, Request, Response } from "express";

import * as companyService from "../services/companyService.js"
import * as errors from "../utils/errorUtils.js"

export default async function apiKeyValidationMiddleware(req: Request, res: Response, next: NextFunction) {
  const { "x-api-key": apiKey } = req.headers;

  if (!apiKey) {
    throw errors.unauthorized("unauthorized");
  }

  const company = await companyService.checkExistence(apiKey);

  if (!company) {
    throw errors.unauthorized("unauthorized");
  }

  res.locals.company = company;

  next();
}