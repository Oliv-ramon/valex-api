import { Request, Response } from "express";

import * as cardService from "../services/cardService.js";

export async function create(req: Request, res: Response) {
  const card = req.body;
  const { apiKey } = res.locals;
  
  const cardToSend = await cardService.create({ apiKey, card });

  res.status(200).send(cardToSend);
}

export async function activate(req: Request, res: Response) {
  const { CVV, password } = req.body;
  const { cardId } = req.params;
  
  await cardService.activate({ cardId, CVV, password });

  res.sendStatus(200);
}