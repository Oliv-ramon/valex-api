import bcrypt from "bcrypt";

import * as errorUtils from "../utils/errorUtils.js";
import * as cardUtils from "../utils/cardUtils.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

interface CreateParams {
  apiKey: string;
  card: cardRepository.Card;
}

interface ActivateParams {
  cardId: number;
  CVV: string;
  password: string;
}

type BlockOrUnblockParams = Pick<ActivateParams, "password" | "cardId"> & {
  action: "block" | "unblock";
};

type CreateVirtualCardParams = Pick<ActivateParams, "password"> & {
  originalCardId: number;
};

type DeleteVirtualCardParams = Pick<ActivateParams, "password"> & {
  virtualCardId: number;
};

interface ValidateCardTypeParams {
  employeeId: number;
  type: cardRepository.TransactionTypes;
}

export async function create({ apiKey, card }: CreateParams) {
  await validateCompanyExistence(apiKey);

  const employeeName = await validateEmployeeExistence(card.employeeId);

  await validateCardType(card);

  const cardWithDefaultData = cardUtils.addDefaultData({
    card,
    employeeName,
    isVirtual: false,
  });

  const unhashedSecurityCode = cardWithDefaultData.securityCode;

  cardWithDefaultData.securityCode = bcrypt.hashSync(
    cardWithDefaultData.securityCode,
    10
  );

  const createdCard = await cardRepository.insert(cardWithDefaultData);
  createdCard.securityCode = unhashedSecurityCode;

  return createdCard;
}

export async function activate({ cardId, CVV, password }: ActivateParams) {
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

export async function blockAndUnblock({
  cardId,
  password,
  action,
}: BlockOrUnblockParams) {
  const card = await validateCardExistence(cardId);

  cardUtils.validateExpirationDate(card.expirationDate);

  const hasToBe = action === "block" ? false : true;
  cardUtils.validateCardLock({ isBlocked: card.isBlocked, hasToBe });

  cardUtils.validatePassword({ password, storedPassword: card.password });

  const isBlocked = action === "block" ? true : false;
  await cardRepository.update(cardId, { isBlocked });
}

export async function createVirtualCard({
  originalCardId,
  password,
}: CreateVirtualCardParams) {
  const card = await validateCardExistence(originalCardId);

  card.password &&
    cardUtils.validatePassword({ password, storedPassword: card.password });
  delete card.password;

  const { fullName: employeeName } = await employeeRepository.findById(
    card.employeeId
  );

  const cardWithDefaultData = cardUtils.addDefaultData({
    card,
    employeeName,
    isVirtual: true,
  });
  delete cardWithDefaultData.id;

  const unhashedSecurityCode = cardWithDefaultData.securityCode;

  cardWithDefaultData.securityCode = bcrypt.hashSync(
    cardWithDefaultData.securityCode,
    10
  );

  const cardCreated = await cardRepository.insert(cardWithDefaultData);
  cardCreated.securityCode = unhashedSecurityCode;

  return cardCreated;
}

export async function deleteVirtualCard({
  virtualCardId,
  password,
}: DeleteVirtualCardParams) {
  const card = await validateCardExistence(virtualCardId);

  cardUtils.validateIsVirtual({ isVirtual: card.isVirtual, hasToBe: true });

  cardUtils.validateExpirationDate(card.expirationDate);

  card.password &&
    cardUtils.validatePassword({ password, storedPassword: card.password });

  await cardRepository.remove(virtualCardId);
}

async function validateCardType({ type, employeeId }: ValidateCardTypeParams) {
  const cardWithTheSameType = await cardRepository.findByTypeAndEmployeeId(
    type,
    employeeId
  );

  if (cardWithTheSameType) {
    throw errorUtils.badRequestError(
      "employee can't have more than one card per type"
    );
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
