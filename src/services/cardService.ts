import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import bcrypt from "bcrypt";

import * as errorUtils from "../utils/errorUtils.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

export async function create({ apiKey, card }) {
  const company = await validateCompanyExistence(apiKey);

  const employeeName = await validateEmployeeExistence(card.employeeId);

  await validateCardType(card);
  
  validateCardFlag(card.flag);
  delete card.flag;

  const cardWithDefaultData = addDefaultData(card, employeeName);
  console.log(cardWithDefaultData)
}
  
  async function validateCardType({ type, employeeId }) {
  const cardTypes = [
    "groceries",
    "restaurants",
    "transport",
    "education",
    "health",
  ];

  if (!cardTypes.includes(type)) {
    throw errorUtils.unprocessableEntityError("card type must be in [groceries, restaurants, transport, education, health]");
  }

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
  
  return company;
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