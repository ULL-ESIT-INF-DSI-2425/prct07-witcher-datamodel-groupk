import { Assets } from "../items/asset.js";
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
   * @param _quantity - Cantidad de cada bien
   */
  constructor(protected readonly _date: Date, protected readonly _exchangeAssets: Assets[], protected readonly _quantity: number[]) {
    if (_exchangeAssets.length !== _quantity.length) {
      throw new Error("Cada bien tiene que tener especificada una cantidad específica.");
    } else if (_exchangeAssets.length === 0) {
      throw new Error("La transacción debe de tener al menos un bien.");
    }
    
    _exchangeAssets.forEach((asset, index) => {
      this._crowns += asset.crowns * _quantity[index];
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
    * @returns Lista de bienes y sus respectivas cantidades
    */
   getExchangeAssets(): Stock[] {
    const assetQuantity: Stock[] = [];

    this._exchangeAssets.forEach((elem, index) => {
      assetQuantity.push([elem, this._quantity[index]]);
    });

    return assetQuantity;
   }

   /**
     * Función que determina que no es un reembolso
     * @return - Booleano que indica si es true (es un reembolso) o false (compra)
     */
   get isRefund(): boolean {
    return false;
  }
}