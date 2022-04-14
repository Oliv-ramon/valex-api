import { Request, Response } from "express";

import * as errors from "../utils/errorUtils.js";

export async function create(req: Request, res: Response) {
  const card = req.body;

  const cardTypes = {
    groceries: true,
    restaurants: true,
    transport: true,
    education: true,
    health: true,
  };

  if (!cardTypes[card.type]) {
    throw errors.unprocessableEntity("card type must be in [groceries, restaurants, transport, education, health]");
  }

  res.sendStatus(200);
}