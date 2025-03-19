import { Transaction } from "../transactions/transaction.js";
import { Merchant } from "../characters/merchant.js";
import { Stock } from "../types/stock.js";
import { Date } from "../utils/date.js";

export class BuyTransaction extends Transaction {
    constructor(date: Date, assets: Stock[], private readonly _merchant: Merchant) {
        super(date, assets);
    }
}