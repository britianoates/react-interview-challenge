import { query } from "../utils/db";

const transactionWithdrawLimit:number = +(process.env.TRANSACTION_WITHDRAW_LIMIT || 200)
const dailyWithdrawLimit = +(process.env.DAILY_WITHDRAW_LIMIT || 400)

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
    (account:any, transactions:Array<any>, amount:number) => {return amount == 0 ? "Amount cannot be zero" : ""},
    (account:any, transactions:Array<any>, amount:number) => {return amount < 0 ? "Amount cannot be negative" : ""},
    (account:any, transactions:Array<any>, amount:number) => {return amount > transactionWithdrawLimit ? "Amount over per transaction limit" : ""},
    (account:any, transactions:Array<any>, amount:number) => {return amount % 5 != 0 ? "Amount not in $5 increments" : ""},
    (account:any, transactions:Array<any>, amount:number) => {return account.type == "checking" && account.amount < amount ? "Insufficient funds" : ""},
    (account:any, transactions:Array<any>, amount:number) => {return account.type == "savings" && account.amount < amount ? "Insufficient funds" : ""},
    //credit check, we take the amount they already owe minus the additional amount they are requesting. this number is negative the total amount they would owe.
    // By adding their credit limit (which is stored as a positve integer) we have a positive number they would be available to borrow after this transaction, or its been maxed
    (account:any, transactions:Array<any>, amount:number) => {return account.type == "credit" && account.amount - amount + account.credit_limit < 0 ? "Insufficient credit" : ""},
    (account:any, transactions:Array<any>, amount:number) => {
        const todaysDate = new Date().toDateString()
        const todaysTransactions = transactions.filter(it => (new Date(parseInt(it.date_time)).toDateString() == todaysDate))
        const todaysWithdrawls = todaysTransactions.filter(it => it.amount < 0)
        const todaysTotalWithdrawn = todaysWithdrawls.reduce((sum, current) => current.amount + sum, 0)
        return todaysTotalWithdrawn - amount < -dailyWithdrawLimit ? "Withdraw amount would go past the daily limit" : ""},
]

export const getWithdrawValidationErrors = async (account: any, amount: number) => {
  const transactions = await getTransactions(account.account_number);
  const errors = withdrawlRules.map((it:Function) => it(account, transactions, amount)).filter((it:string) => it.length > 0)
  return errors;
}