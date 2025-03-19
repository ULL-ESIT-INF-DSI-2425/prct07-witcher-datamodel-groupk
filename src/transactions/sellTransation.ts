import { Transaction } from "../transactions/transaction.js";
import { Clients } from "../characters/client.js";
import { Stock } from "../types/stock.js";
import { Date } from "../utils/date.js";
import { TransactionType } from "../types/transaction-type.js";

/**
 * Clase SellTransaction. Representa una transacción de venta de la posada a un cliente
 */
export class SellTransaction extends Transaction {

    /**
     * Constructor de SellTransaction
     * @param date - Fecha de la transacción
     * @param assets - Bienes vendidos
     * @param _client - Cliente al que se realiza la venta
     */
    constructor(date: Date, assets: Stock[], type: TransactionType, private readonly _client: Clients) {
        super(date, assets, type);
        this._crowns *= 1.2;
    }
}