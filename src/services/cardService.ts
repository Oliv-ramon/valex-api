import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import bcrypt from "bcrypt";

import * as errorUtils from "../utils/errorUtils.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

export async function create({ apiKey, card }) {
  await validateCompanyExistence(apiKey);

  const employeeName = await validateEmployeeExistence(card.employeeId);

  await validateCardType(card);
  
  validateCardFlag(card.flag);
  delete card.flag;

  const cardWithDefaultData = addDefaultData(card, employeeName);
  
  await cardRepository.insert(cardWithDefaultData);
}

export async function activate({ cardId, CVV, password }) {
  const card = await validateCardExistence(cardId);

  await validateExpirationDate(card.expirationDate);
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
    securityCode: bcrypt.hashSync(faker.finance.creditCardCVV(), 10),
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

async function validateExpirationDate(expirationDate: string) {
  const [expirationMonth, expirationYear] = expirationDate.split("/");
  const formatedExpirationDate = `20${expirationYear}-${expirationMonth}-01`;

  const timeToExpiration = dayjs(formatedExpirationDate).diff(dayjs());

  if (timeToExpiration < 0) {
    throw errorUtils.badRequestError("the expiration date has been exceeded");
  }
}