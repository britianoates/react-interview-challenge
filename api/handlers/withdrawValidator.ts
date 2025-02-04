import { query } from "../utils/db";

const getTransactions = async (accountID: string) => {
    const res = await query(`
        SELECT account_number, amount, date_time
        FROM transactions
        WHERE account_number = $1`,
        [accountID]
      );
      
      return res.rows;
}

const withdrawlRules = [
    (account:any, transactions:Array<any>, amount:number) => {return amount > 200 ? "Amount over per transaction limit" : ""},
    (account:any, transactions:Array<any>, amount:number) => {return amount % 5 != 0 ? "Amount not in $5 increments" : ""},
]

export const getValidationErrors = async (account: any, amount: number) => {
  const transactions = await getTransactions(account.account_number);
  const errors = withdrawlRules.map((it:Function) => it(account, transactions, amount)).filter((it:string) => it.length > 0)
  return errors;
}