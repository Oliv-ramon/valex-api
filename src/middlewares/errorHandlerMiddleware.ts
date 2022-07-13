import { NextFunction, Request, Response } from "express";

import * as errorUtils from "../utils/errorUtils.js";

export default function errorHandlerMiddleware(
  error: Error | errorUtils.AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.log(error);
  if ("type" in error) {
    const statusCode = errorUtils.typeToStatusCode(error.type);

    return res.status(statusCode).send(error.message);
  }

  res.sendStatus(500);
}
