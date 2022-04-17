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

export async function recharge(req: Request, res: Response) {
  const { amount } = req.body;
  const { cardId } = req.params;
  
  await cardService.recharge({ cardId, amount });

  res.sendStatus(200);
}

export async function purchase(req: Request, res: Response) {
  const { amount, password } = req.body;
  const { cardId, businessId } = req.params;
  
  await cardService.purchase({ cardId, businessId, amount, password });

  res.sendStatus(200);
}