const transactionDepositLimit = +(process.env.TRANSACTION_DEPOSIT_LIMIT || 1000)

const depositRules = [
    (account:any, amount:number) => {return amount == 0 ? "Amount cannot be zero" : ""},
    (account:any, amount:number) => {return amount < 0 ? "Amount cannot be negative" : ""},
    (account:any, amount:number) => {return amount > transactionDepositLimit ? "Amount over per transaction limit" : ""},
    (account:any, amount:number) => {return account.type == "credit" && account.amount + amount > 0 ? "Cannot deposit more than required to settle debt" : ""},
]

export const getDepositValidationErrors = async (account: any, amount: number) => {
  const errors = depositRules.map((it:Function) => it(account, amount)).filter((it:string) => it.length > 0)
  return errors;
}