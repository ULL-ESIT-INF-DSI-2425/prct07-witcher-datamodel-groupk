import { Transaction } from "../transactions/transaction.js";
import { Clients } from "../characters/client.js";
import { Assets } from "../items/asset.js";
import { Date } from "../utils/date.js";

/**
 * Clase SellTransaction. Representa una transacción de venta de la posada a un cliente
 */
export class SellTransaction extends Transaction {

    /**
     * Constructor de SellTransaction
     * @param date - Fecha de la transacción
     * @param assets - Bienes vendidos
     * @param quantity - Cantidad de cada bien
     * @param _client - Cliente al que se realiza la venta
     */
    constructor(date: Date, assets: Assets[], quantity: number[], private readonly _client: Clients) {
        super(date, assets, quantity);
        this._crowns *= 1.2;
    }

    /**
     * Getter de client
     */
    get client() {
        return this._client;
    }

    /**
     * Función que determina que no es un reembolso
     * @return - Booleano que indica si es true (es un reembolso) o false (venta)
     */
    get isRefund(): boolean {
        return false;
    }
}