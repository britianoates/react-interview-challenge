import { query } from "../utils/db";
import { getAccount } from "./accountHandler";
import { getWithdrawValidationErrors } from "./withdrawValidator"
import { getDepositValidationErrors } from "./depositValidator"

export const withdrawal = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID);
  const errors = await getWithdrawValidationErrors(account, amount)
  if(errors.length) {
    throw new Error("There were validation errors: " + (errors).join(", "))
  }
  account.amount -= amount;
  await query(`
    INSERT INTO transactions(account_number, date_time, amount) VALUES ($1, $2, $3)`,
    [accountID, Date.now(), -amount]
  );
  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  return account;
}

export const deposit = async (accountID: string, amount: number) => {
  const account = await getAccount(accountID); 
  const errors = await getDepositValidationErrors(account, amount)
  if(errors.length) {
    throw new Error("There were validation errors: " + (errors).join(", "))
  }
  account.amount += amount;

  await query(`
    INSERT INTO transactions(account_number, date_time, amount) VALUES ($1, $2, $3)`,
    [accountID, Date.now(), amount]
  );
  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  return account;
}