import * as errorUtils from "../utils/errorUtils.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

export async function create({ apiKey, card }) {
  const company = await validateCompanyExistence(apiKey);

  const employee = await validateEmployeeExistence(card.employeeId);

  await validateCardType(card);
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

  return employee;
}
