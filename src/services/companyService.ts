import * as companyRepository from "../repositories/companyRepository.js";

export async function checkExistence(apiKey) {
  return await companyRepository.findByApiKey(apiKey);
}