import { SellTransaction } from "./sellTransation.js";

/**
 * Clase RefundSellTransaction. Representa una devolución de una venta por parte de un cliente
 */
export class RefundSellTransaction extends SellTransaction {
    /**
     * Función que determina que es un reembolso
     * @return - Booleano que indica si es true (es un reembolso) o false (venta)
     */
    get isRefund(): boolean {
        return true;
    }
}