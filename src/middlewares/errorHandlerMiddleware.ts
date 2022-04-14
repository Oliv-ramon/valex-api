import { NextFunction, Request, Response } from "express";

export default function errorHandlerMiddleware(error, req: Request, res: Response, next: NextFunction) {
  if (error.typeCode) {
    console.log(error);
    return res.status(error.typeCode).send(error.message);
  }

  console.log(error);
  res.sendStatus(500);
} 