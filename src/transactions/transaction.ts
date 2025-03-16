import { Assets } from "../items/asset.js";
import { TransactionType } from "../enums/transaction-type.js";
import { Date } from "../utils/date.js"

export class Transaction {
    constructor(
      private readonly date: Date, 
      private readonly exchange_asset: Assets[], 
      private readonly crowns: number, 
      private readonly type: TransactionType) {}
    
}