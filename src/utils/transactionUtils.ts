import dayjs from "dayjs";

import * as errorUtils from "./errorUtils.js"

export function validateTypeMatch({ cardType, businessType }) { 
  if (cardType !== businessType) {
    throw errorUtils.badRequestError("card type and business type don't match");
  }
}

export function calculateBalance({ recharges, payments }) {
  let balance = 0;

  recharges.forEach(({ amount }) => balance += amount);
  payments.forEach(({ amount }) => balance -= amount);

  return balance;
}

export function formatTransactionTimeStamp(transactions) {
  const formatedTransactions = transactions.map((transaction) => {
    const date = transaction.timestamp.toISOString().split("T")[0];
    const formatedTimestamp = dayjs(date).format("DD/MM/YYYY");

    return {
      ...transaction,
      timestamp: formatedTimestamp,
    }
  });

  return formatedTransactions;
}