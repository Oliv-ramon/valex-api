import dayjs from "dayjs";
import * as cardRepository from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";

import * as errorUtils from "./errorUtils.js";

interface ValidateTypeMatchParams {
  cardType: cardRepository.TransactionTypes;
  businessType: cardRepository.TransactionTypes;
}

interface CalculateBalanceParams {
  recharges: rechargeRepository.Recharge[];
  payments: paymentRepository.Payment[];
}

export function validateTypeMatch({
  cardType,
  businessType,
}: ValidateTypeMatchParams) {
  if (cardType !== businessType) {
    throw errorUtils.badRequestError("card type and business type don't match");
  }
}

export function calculateBalance({
  recharges,
  payments,
}: CalculateBalanceParams) {
  let balance = 0;

  recharges.forEach(({ amount }) => (balance += amount));
  payments.forEach(({ amount }) => (balance -= amount));

  return balance;
}

export function formatTransactionTimeStamp(
  transactions: rechargeRepository.Recharge[] | paymentRepository.Payment[]
) {
  const formatedTransactions = transactions.map(
    (transaction: rechargeRepository.Recharge | paymentRepository.Payment) => {
      const date = transaction.timestamp.toISOString().split("T")[0];
      const formatedTimestamp = dayjs(date).format("DD/MM/YYYY");

      return {
        ...transaction,
        timestamp: formatedTimestamp,
      };
    }
  );

  return formatedTransactions;
}
