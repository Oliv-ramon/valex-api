import bcrypt from "bcrypt";

import * as errorUtils from "../utils/errorUtils.js";
import * as cardUtils from "../utils/cardUtils.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

export async function create({ apiKey, card }) {
  await validateCompanyExistence(apiKey);

  const employeeName = await validateEmployeeExistence(card.employeeId);

  await validateCardType(card);
  
  cardUtils.validateCardFlag(card.flag);
  delete card.flag;

  const cardWithDefaultData = cardUtils.addDefaultData({ card, employeeName, isVirtual: false});
  const cardToSend = { ...cardWithDefaultData };

  cardWithDefaultData.securityCode = bcrypt.hashSync(cardWithDefaultData.securityCode,  10);
  
  await cardRepository.insert(cardWithDefaultData);

  return cardToSend;
}

export async function activate({ cardId, CVV, password }) {
  const card = await validateCardExistence(cardId);

  cardUtils.validateIsVirtual({ isVirtual: card.isVirtual, hasToBe: false });

  cardUtils.validateExpirationDate(card.expirationDate);

  cardUtils.validateCardLock({ isBlocked: card.isBlocked, hasToBe: true });

  cardUtils.validateCVV(CVV, card.securityCode);

  cardUtils.validatePasswordFormat(password);
  
  await cardRepository.update(cardId, {
    isBlocked: false,
    password: bcrypt.hashSync(password, 10),
  });
}

export async function blockAndUnblock({ cardId, password, action }) {
  const card = await validateCardExistence(cardId);

  cardUtils.validateExpirationDate(card.expirationDate);
  
  const hasToBe = action === "block" ? false : true;
  cardUtils.validateCardLock({ isBlocked: card.isBlocked, hasToBe });

  cardUtils.validatePassword({ password, storedPassword: card.password });

  const isBlocked = action === "block" ? true : false;
  await cardRepository.update(cardId, { isBlocked });
}

export async function createVirtualCard({ originalCardId, flag, password }) {
  const card = await validateCardExistence(originalCardId);

  cardUtils.validatePassword({ password, storedPassword: card.password});

  cardUtils.validateCardFlag(flag);

  const { fullName: employeeName } = await employeeRepository.findById(card.employeeId);

  const cardWithDefaultData = cardUtils.addDefaultData({ card, employeeName, isVirtual: true });
  delete cardWithDefaultData.id;

  const virtualCard = { ...cardWithDefaultData };  
  delete virtualCard.password;

  cardWithDefaultData.securityCode = bcrypt.hashSync(cardWithDefaultData.securityCode,  10);

  await cardRepository.insert(cardWithDefaultData);

  return virtualCard;
}

export async function deleteVirtualCard({ virtualCardId, password }) {
  const card = await validateCardExistence(virtualCardId);

  cardUtils.validateIsVirtual({ isVirtual: card.isVirtual, hasToBe: true });

  cardUtils.validateExpirationDate(card.expirationDate);

  cardUtils.validatePassword({ password, storedPassword: card.password });

  await cardRepository.remove(virtualCardId);
}
  
async function validateCardType({ type, employeeId }) {
  const cardWithTheSameType = await cardRepository.findByTypeAndEmployeeId(type, employeeId);

  if (cardWithTheSameType) {
    throw errorUtils.badRequestError("employee can't have more than one card per type");
  }
}

async function validateCompanyExistence(apiKey: string) {
  const company = await companyRepository.findByApiKey(apiKey);

  if (!company) {
    throw errorUtils.notFoundError("company not found");
  }
}

async function validateEmployeeExistence(employeeId: number) {
  const employee = await employeeRepository.findById(employeeId);

  if (!employee) {
    throw errorUtils.notFoundError("employee not found");
  }

  return employee.fullName;
}

export async function validateCardExistence(cardId: number) {
  const card = await cardRepository.findById(cardId);

  if (!card) {
    throw errorUtils.notFoundError("card not found");
  }

  return card;
}