import { NextFunction, Request, Response } from "express";

export default function errorHandlerMiddleware(error, _req: Request, res: Response, _next: NextFunction) {
  if (error.typeCode) {
    console.log(error);
    return res.status(error.typeCode).send(error.message);
  }

  console.log(error);
  res.sendStatus(500);
} 