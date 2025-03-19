import { Transaction } from "../transactions/transaction.js";
import { Clients } from "../characters/client.js";
import { Stock } from "../types/stock.js";
import { Date } from "../utils/date.js";

export class SellTransaction extends Transaction {
    constructor(date: Date, assets: Stock[], private readonly _client: Clients) {
        super(date, assets);
    }
}