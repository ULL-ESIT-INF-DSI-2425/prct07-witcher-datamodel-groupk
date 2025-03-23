import { BuyTransaction } from "./buyTransaction.js";

/**
 * Clase RefundBuyTransaction. Representa una transacción de devolución de mercancías a un mercader
 */
export class RefundBuyTransaction extends BuyTransaction {
    /**
     * Función que determina que es un reembolso
     * @return - Booleano que indica si es true (es un reembolso) o false (compra)
     */
    get isRefund(): boolean {
        return true;
    }
}