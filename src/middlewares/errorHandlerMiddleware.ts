import { NextFunction, Request, Response } from "express";

import * as errorService from "../utils/errorUtils.js";

export default function errorHandlerMiddleware(error, _req: Request, res: Response, _next: NextFunction) {
  if (error.type) {
    console.log(error);
    const statusCode = errorService.typeToStatusCode(error.type);

    return res.status(statusCode).send(error.message);
  }

  console.log(error);
  res.sendStatus(500);
} 