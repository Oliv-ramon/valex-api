import * as errors from "../utils/errorUtils.js";
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
    throw errors.unprocessableEntity("card type must be in [groceries, restaurants, transport, education, health]");
  }

  const cardWithTheSameType = await cardRepository.findByTypeAndEmployeeId(type, employeeId);

  if (cardWithTheSameType) {
    throw errors.badRequest("employee can't have more than one card per type");
  }
}

async function validateCompanyExistence(apiKey: string) {
  const company = await companyRepository.findByApiKey(apiKey);
  if (!company) {
    throw errors.notFound("company not found");
  }
  
  return company;
}

async function validateEmployeeExistence(employeeId: number) {
  const employee = await employeeRepository.findById(employeeId);

  if (!employee) {
    throw errors.notFound("employee not found");
  }

  return employee;
}
