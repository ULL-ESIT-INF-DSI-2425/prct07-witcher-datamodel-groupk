import { Transaction } from "../transactions/transaction.js";
import { Merchant } from "../characters/merchant.js";
import { Stock } from "../types/stock.js";
import { Date } from "../utils/date.js";

/**
 * Clase BuyTransaction. Representa una transacción de compra a un mercader
 */
export class BuyTransaction extends Transaction {

    /**
     * Constructor de BuyTransaction
     * @param date - Fecha en la que se realizó la compra
     * @param assets - Bienes comprados
     * @param _merchant - Mercader al que se le realizó la compra
     */
    constructor(date: Date, assets: Stock[], private readonly _merchant: Merchant) {
        super(date, assets);
    }

    /**
     * Getter de merchant
     */
    get merchant() {
        return this._merchant;
    }
}