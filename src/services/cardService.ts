import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import bcrypt from "bcrypt";

import * as errorUtils from "../utils/errorUtils.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";

export async function create({ apiKey, card }) {
  await validateCompanyExistence(apiKey);

  const employeeName = await validateEmployeeExistence(card.employeeId);

  await validateCardType(card);
  
  validateCardFlag(card.flag);
  delete card.flag;

  const cardWithDefaultData = addDefaultData(card, employeeName);
  const cardToSend = { ...cardWithDefaultData };

  cardWithDefaultData.securityCode = bcrypt.hashSync(cardWithDefaultData.securityCode,  10)
  
  await cardRepository.insert(cardWithDefaultData);

  return cardToSend;
}

export async function activate({ cardId, CVV, password }) {
  const card = await validateCardExistence(cardId);

  validateExpirationDate(card.expirationDate);

  validateCardActivation(card.isBlocked);

  validateCVV(CVV, card.securityCode);

  validatePasswordFormat(password);
  
  await cardRepository.update(cardId, {
    isBlocked: false,
    password: bcrypt.hashSync(password, 10),
  })
}

export async function recharge({ cardId, amount }) {
  const card = await validateCardExistence(cardId);

  validateExpirationDate(card.expirationDate);

  await rechargeRepository.insert({ cardId, amount });
}

export async function purchase({ cardId, businessId, amount, password }) {
  const card = await validateCardExistence(cardId);

  validateExpirationDate(card.expirationDate);

  validatePassword({ password, storedPassword: card.password});

  const business = await validateBusiness(businessId);

  validateTypeMatch({ cardType: card.type, businessType: business.type });

  await validateCardBalance({ cardId: card.id, amount});

  await paymentRepository.insert({ cardId, businessId, amount });
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

function validateCardFlag(flag: string) {
  if (flag !== "MasterCard") {
    throw errorUtils.badRequestError("the card flag must be MasterCard");
  }
}

function addDefaultData(card, employeeName: string) {

  const cardWithDefaultData = {
    ...card,
    number: faker.finance.creditCardNumber("#### #### #### ####"),
    cardholderName: formatEmployeeName(employeeName),
    securityCode: faker.finance.creditCardCVV(),
    expirationDate: dayjs().add(5, "years").format("MM/YY"),
    isVirtual: false,
    isBlocked: true,
  };

  return cardWithDefaultData;
}

function formatEmployeeName(employeeName: string) {
  const names = employeeName.split(" ").filter(str => str.length > 2);

  const firstNameId = 0;
  const lastNameId = names.length-1;

  const abreviatedAndUppercasedNames = names.map((name, arrayId) => {
    const isLastOrFirstName = arrayId === firstNameId || arrayId === lastNameId;

    if (isLastOrFirstName) {
      return name.toUpperCase();
    }
    
    return name[0].toUpperCase();
  });

  return abreviatedAndUppercasedNames.join(" ");
}

async function validateCardExistence(cardId: number) {
  const card = await cardRepository.findById(cardId);

  if (!card) {
    throw errorUtils.notFoundError("card not found");
  }

  return card;
}

function validateExpirationDate(expirationDate: string) {
  const [expirationMonth, expirationYear] = expirationDate.split("/");
  const formatedExpirationDate = `20${expirationYear}-${expirationMonth}-01`;

  const timeToExpiration = dayjs(formatedExpirationDate).diff(dayjs());

  if (timeToExpiration < 0) {
    throw errorUtils.badRequestError("the expiration date has been exceeded");
  }
}

function validateCVV(CVV: string, CVVOnDb: string) {
  const isTheSame = bcrypt.compareSync(CVV, CVVOnDb);

  if (!isTheSame) {
    throw errorUtils.unauthorizedError("security code is incorrect");
  }
}

function validateCardActivation(isBlocked: boolean) {
  if(!isBlocked) {
    throw errorUtils.badRequestError("this card is already active")
  }
}

function validatePasswordFormat(password: string) {
  if (password.length !==  4) {
    throw errorUtils.badRequestError("password must have included just 4 digits");
  }

  const justHaveNumbers = Array
    .from(password)
    .every(item => {
      return parseInt(item) % 1 === 0;
    }); 
  
  if (!justHaveNumbers) {
    throw errorUtils.badRequestError("password must have included just 4 digits");
  }
}

function validatePassword({ password, storedPassword}) {
  const isTheSame = bcrypt.compareSync(password, storedPassword);

  if(!isTheSame) {
    throw errorUtils.unauthorizedError("the password is incorrect");
  }
}

async function validateBusiness(businessId: number) {
  const business = businessRepository.findById(businessId);

  if (!business) {
    throw errorUtils.notFoundError("business not found");
  }

  return business;
}

function validateTypeMatch({ cardType, businessType }) {
  if (cardType !== businessType) {
    throw errorUtils.badRequestError("card type and business type don't match");
  }
}

async function validateCardBalance({ cardId, amount }) {
  const recharges = await rechargeRepository.findByCardId(cardId);
  const payments = await paymentRepository.findByCardId(cardId);

  let balance = 0;

  recharges.forEach(({ amount }) => balance += amount);
  payments.forEach(({ amount }) => balance -= amount);

  if (amount > balance) {
    throw errorUtils.badRequestError("card balance isn't enough");
  }
}