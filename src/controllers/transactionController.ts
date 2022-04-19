import { Request, Response } from "express";

import * as transactionService from "../services/transactionService.js";

export async function getStatement(req: Request, res: Response) {
  const { cardId } = req.params;
  
  const statement = await transactionService.getStatement(parseInt(cardId));

  res.status(200).send(statement);
}

export async function createRecharge(req: Request, res: Response) {
  const { amount } = req.body;
  const { cardId } = req.params;
  
  await transactionService.recharge({ cardId, amount });

  res.sendStatus(200);
}

export async function CreatePurchase(req: Request, res: Response) {
  const { amount, password } = req.body;
  const { cardId, businessId } = req.params;
  
  await transactionService.purchase({ cardId, businessId, amount, password });

  res.sendStatus(200);
}

export async function createOnlinePurchase(req: Request, res: Response) {
  const { businessId } = req.params;
  const { amount, cardDetails } = req.body;
  
  await transactionService.onlinePurchase({ amount, cardDetails, businessId });

  res.sendStatus(200);
}