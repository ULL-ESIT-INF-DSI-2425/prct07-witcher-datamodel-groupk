import { Stock } from "../types/stock.js";
import { Date } from "../utils/date.js"

/**
 * Clase abstracta Transaction. Representa la forma mínima que ha de tener una transacción
 */
export abstract class Transaction {
  protected _crowns: number = 0;
  
  /**
   * Constructor de Transaction
   * @param _date - Fecha en la que se realizó la transacción
   * @param _exchangeAssets - Bienes que son intercambiados
   */
  constructor(protected readonly _date: Date, protected readonly _exchangeAssets: Stock[]) {
    _exchangeAssets.forEach((asset) => {
      this._crowns += asset[0].crowns * asset[1];
    });
   }

   /**
    * Getter de date
    */
   get date() {
    return this._date;
   }

   /**
    * Getter de crowns
    */
   get crowns() {
    return this._crowns;
   }

   /**
    * Getter de exchangeAssets
    */
   get exchangeAssets() {
    return this._exchangeAssets;
   }
}