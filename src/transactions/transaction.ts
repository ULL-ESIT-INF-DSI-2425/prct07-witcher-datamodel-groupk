import { Assets } from "../items/asset.js";
import { TransactionType } from "../enums/transaction-type.js";
import { Stock } from "../types/stock.js";
import { Date } from "../utils/date.js"

export abstract class Transaction {
  protected _crowns: number = 0;
  
    constructor(protected readonly _date: Date, protected readonly _exchangeAsset: Stock[]) {
      _exchangeAsset.forEach((asset) => {
        this._crowns += asset[0].crowns;
      })
    }
    
}