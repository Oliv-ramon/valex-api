import dayjs from "dayjs";

import * as errorUtils from "../utils/errorUtils.js";
import * as cardUtils from "../utils/cardUtils.js";
import * as transactionUtils from "../utils/transactionUtils.js";
import * as cardService from "./cardService.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";

export async function recharge({ cardId, amount }) {
  const card = await cardService.validateCardExistence(cardId);

  cardUtils.validateIsVirtual({ isVirtual: card.isVirtual, hasToBe: false });

  cardUtils.validateExpirationDate(card.expirationDate);

  await rechargeRepository.insert({ cardId, amount });
}

export async function purchase({ cardId, businessId, amount, password }) {
  const card = await cardService.validateCardExistence(cardId);

  cardUtils.validateIsVirtual({ isVirtual: card.isVirtual, hasToBe: false });

  cardUtils.validateExpirationDate(card.expirationDate);

  cardUtils.validateCardLock({ isBlocked: card.isBlocked, hasToBe: false });

  cardUtils.validatePassword({ password, storedPassword: card.password});

  const business = await validateBusiness(businessId);

  transactionUtils.validateTypeMatch({ cardType: card.type, businessType: business.type });

  await validateCardBalance({ cardId: card.id, amount});

  await paymentRepository.insert({ cardId, businessId, amount });
}

export async function getStatement(cardId: number) {
  await cardService.validateCardExistence(cardId);

  const statement = buildStatement(cardId);

  return statement;
}

export async function onlinePurchase({ amount, cardDetails, businessId }) {
  const card = await validateCardDetails(cardDetails);

  cardUtils.validateExpirationDate(card.expirationDate);

  cardUtils.validateCardLock({ isBlocked: card.isBlocked, hasToBe: false });

  const business = await validateBusiness(businessId);

  transactionUtils.validateTypeMatch({ cardType: card.type, businessType: business.type });

  const cardId = card.isVirtual ? card.originalCardId : card.id;
  await validateCardBalance({ cardId, amount});

  await paymentRepository.insert({ cardId, businessId, amount});
}

async function buildStatement(cardId: number) {
  const recharges = await rechargeRepository.findByCardId(cardId);
  const payments = await paymentRepository.findByCardId(cardId);

  const balance = transactionUtils.calculateBalance({ recharges, payments });
  
  const formatedRecharges = transactionUtils.formatTransactionTimeStamp(recharges);
  const formatedTransactions = transactionUtils.formatTransactionTimeStamp(payments);
  
  return {
    balance,
    recharges: formatedRecharges,
    transactions: formatedTransactions,
  };
}

async function validateBusiness(businessId: number) {
  const business = await businessRepository.findById(businessId);
  
  if (!business) {
    throw errorUtils.notFoundError("business not found");
  }

  return business;
}

async function validateCardBalance({ cardId, amount }) {
  const recharges = await rechargeRepository.findByCardId(cardId);
  const payments = await paymentRepository.findByCardId(cardId);

  const balance = transactionUtils.calculateBalance({ recharges, payments });

  if (amount > balance) {
    throw errorUtils.badRequestError("card balance isn't enough");
  }
}

async function validateCardDetails({ number, cardholderName, expirationDate, securityCode }) {
  const card = await cardRepository.findByCardDetails(number, cardholderName, expirationDate);

  if (!card) {
    throw errorUtils.notFoundError("card not found");
  }

  cardUtils.validateCVV( securityCode, card.securityCode);

  return card;
}