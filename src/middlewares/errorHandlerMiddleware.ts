import { NextFunction, Request, Response } from "express";

import * as errorService from "../services/errorService.js";

export default function errorHandlerMiddleware(error, _req: Request, res: Response, _next: NextFunction) {
  if (error.type) {
    const statusCode = errorService.typeToStatusCode(error.type);
    console.log(error);
    return res.status(error.typeCode).send(error.message);
  }

  console.log(error);
  res.sendStatus(500);
} 