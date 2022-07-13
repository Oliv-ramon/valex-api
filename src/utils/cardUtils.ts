import dayjs from "dayjs";
import bcrypt from "bcrypt";
import faker from "@faker-js/faker";

import * as errorUtils from "./errorUtils.js";
import * as cardRepository from "../repositories/cardRepository.js";

interface ValidateCardLockParams {
  isBlocked: boolean;
  hasToBe: boolean;
}

interface ValidatePasswordParams {
  password: string;
  storedPassword: string;
}

type ValidateIsVirtualParams = Pick<ValidateCardLockParams, "hasToBe"> & {
  isVirtual: boolean;
};

type AddDefaultDataParams = Pick<ValidateIsVirtualParams, "isVirtual"> & {
  card: cardRepository.Card;
  employeeName: string;
};

export function validateExpirationDate(expirationDate: string) {
  const [expirationMonth, expirationYear] = expirationDate.split("/");
  const formatedExpirationDate = `20${expirationYear}-${expirationMonth}-01`;

  const timeToExpiration = dayjs(formatedExpirationDate).diff(dayjs());

  if (timeToExpiration < 0) {
    throw errorUtils.badRequestError("the expiration date has been exceeded");
  }
}

export function validateCVV(CVV: string, CVVOnDb: string) {
  const isTheSame = bcrypt.compareSync(CVV, CVVOnDb);

  if (!isTheSame) {
    throw errorUtils.unauthorizedError("security code is incorrect");
  }
}

export function validateCardLock({
  isBlocked,
  hasToBe,
}: ValidateCardLockParams) {
  const errorMessage = hasToBe
    ? "this card is already active"
    : "this card is already blocked";

  if (isBlocked !== hasToBe) {
    throw errorUtils.badRequestError(errorMessage);
  }
}

export function validatePasswordFormat(password: string) {
  if (password.length !== 4) {
    throw errorUtils.badRequestError(
      "password must have included just 4 digits"
    );
  }

  const justHaveNumbers = Array.from(password).every((item) => {
    return parseInt(item) % 1 === 0;
  });

  if (!justHaveNumbers) {
    throw errorUtils.badRequestError(
      "password must have included just 4 digits"
    );
  }
}

export function validatePassword({
  password,
  storedPassword,
}: ValidatePasswordParams) {
  const isTheSame = bcrypt.compareSync(password, storedPassword);

  if (!isTheSame) {
    throw errorUtils.unauthorizedError("the password is incorrect");
  }
}

export function validateIsVirtual({
  isVirtual,
  hasToBe,
}: ValidateIsVirtualParams) {
  const errorMessage = hasToBe
    ? "this card isn't virtual"
    : "this feature isn't allowed to virtual cards";

  if (isVirtual !== hasToBe) {
    throw errorUtils.badRequestError(errorMessage);
  }
}

export function addDefaultData({
  card,
  employeeName,
  isVirtual,
}: AddDefaultDataParams) {
  const cardWithDefaultData = {
    ...card,
    type: card.type,
    originalCardId: isVirtual ? card.id : null,
    number: faker.finance.creditCardNumber("#### #### #### ####"),
    cardholderName: formatEmployeeName(employeeName),
    securityCode: faker.finance.creditCardCVV(),
    expirationDate: dayjs().add(5, "years").format("MM/YY"),
    password: isVirtual ? card.password : null,
    isVirtual,
    isBlocked: isVirtual ? false : true,
  };

  return cardWithDefaultData;
}

function formatEmployeeName(employeeName: string) {
  const names = employeeName.split(" ").filter((str) => str.length > 2);

  const firstNameId = 0;
  const lastNameId = names.length - 1;

  const abreviatedAndUppercasedNames = names.map((name, arrayId) => {
    const isLastOrFirstName = arrayId === firstNameId || arrayId === lastNameId;

    if (isLastOrFirstName) {
      return name.toUpperCase();
    }

    return name[0].toUpperCase();
  });

  return abreviatedAndUppercasedNames.join(" ");
}
