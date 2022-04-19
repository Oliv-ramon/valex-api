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

export async function createVirtualCard(req: Request, res: Response) {
  const { originalCardId } = req.params;
  const { flag, password } = req.body;
  
  const virtualCard = await cardService.createVirtualCard({ originalCardId, flag, password });

  res.status(201).send(virtualCard);
}

export async function deleteVirtualCard(req: Request, res: Response) {
  const { virtualCardId } = req.params;
  const { password } = req.body;
  
  await cardService.deleteVirtualCard({ virtualCardId, password });

  res.sendStatus(200);
}