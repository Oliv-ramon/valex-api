import { Request, Response } from "express";

import * as cardService from "../services/cardService.js";

export async function create(req: Request, res: Response) {
  const card = req.body;
  const { apiKey } = res.locals;
  
  const cardToSend = await cardService.create({ apiKey, card });

  res.status(201).send(cardToSend);
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

export async function getStatement(req: Request, res: Response) {
  const { cardId } = req.params;
  
  const statement = await cardService.getStatement(parseInt(cardId));

  res.status(200).send(statement);
}

export async function block(req: Request, res: Response) {
  const { cardId } = req.params;
  const { password } = req.body;
  
  await cardService.blockAndUnblock({ cardId, password, action: "block" });

  res.sendStatus(200);
}

export async function unblock(req: Request, res: Response) {
  const { cardId } = req.params;
  const { password } = req.body;
  
  await cardService.blockAndUnblock({ cardId, password, action: "unblock" });

  res.sendStatus(200);
}

export async function onlinePurchase(req: Request, res: Response) {
  const { businessId } = req.params;
  const { amount, cardDetails } = req.body;
  
  await cardService.onlinePurchase({ amount, cardDetails, businessId });

  res.sendStatus(200);
}