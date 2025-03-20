import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import { Transaction } from "../transactions/transaction.js";
import { Stock } from "../types/stock.js";
import { Date } from "../utils/date.js";
import { db } from "../database/database.js";
import { BuyTransaction } from "../transactions/buyTransaction.js";
import { SellTransaction } from "../transactions/sellTransation.js";
import { RefundBuyTransaction } from "../transactions/refundBuyTransaction.js";
import { RefundSellTransaction } from "../transactions/refundSellTransaction.js";

/**
 * Clase Inventary. Representa un inventario compuesto de bienes, mercaderes y clientes
 */
export class Inventary {

  private _transactions: Transaction[] = [];

  /**
   * Constructor de Inventary
   * @param _assetsList - Lista de bienes
   */
  constructor(private _assetsList: Stock[]) { }

  /**
   * Getter de assetsList
   */
  get assetsList() {
    return this._assetsList;
  }

  /**
   * Getter de transactions
   */
  get transactions() {
    return this._transactions;
  }
  
  /**
   * Añade al inventario un bien
   * @param stock - Bien y su cantidad a añadir
   */
  private addAssets(stock: Stock): void {
    if (this._assetsList.some((asset) => asset[0] === stock[0])) {
      const index: number = this._assetsList.findIndex((asset) => asset[0] === stock[0]);
      this._assetsList[index][1] += stock[1];
    } else {
      this._assetsList.push(stock);
    }
  }

  /**
   * Elimina un bien del inventario
   * @param stock - Bien a eliminar
   */
  private removeAssets(stock: Stock): void {
    this._assetsList.forEach((element, index) => {
        if (element[0] === stock[0]) {
          element[1] -= stock[1];

          if (element[1] <= 0) {
            this._assetsList.splice(index);
          }
        }
    });
  }

  /**
   * La posada compra una serie de bienes a un mercader
   * @param merchant - Mercader al que se realiza la compra
   * @param date - Fecha en el que se realiza la venta
   * @param assets - Bienes que se compran
   */
  buyAssets(merchant: Merchant, date: Date, ...assets: Stock[]): void {
    if (db.data.merchants.includes(merchant)) {
      assets.forEach((asset) => {
        if (!db.data.assets.find((asst) => asst === asset[0])) {
          throw new Error("El bien que quieres comprar no existe.");
        }
      });

      assets.forEach((asset) => {
        this.addAssets(asset);
      });

      this._transactions.push(new BuyTransaction(date, assets, merchant));
    } else {
      throw new Error("El mercader al que le quieres comprar no existe.");
    }
  }

  // Código en proceso
  //refundBuyAssets(merchant: Merchant, date: Date, ...assets: Stock[]): void {
  //  if (db.data.merchants.includes(merchant)) {
  //    if (this._transactions.some((trans) => trans instanceof BuyTransaction && ))
//
  //    assets.forEach((asset) => {
  //      if (!db.data.assets.find((asst) => asst === asset[0])) {
  //        throw new Error("El bien que quieres comprar no existe.");
  //      }
  //    });
//
 //     assets.forEach((asset) => {
   //     this.removeAssets(asset);
  //    });
//
  //    this._transactions.push(new BuyTransaction(date, assets, merchant));
  //  } else {
  //    throw new Error("El mercader al que le quieres devolver la mercancía no existe.");
  //  }
  //}

  /**
   * Vende una serie de bienes a un cliente
   * @param client - Cliente al que realizar la venta
   * @param date - Fecha en la que se realizó la venta
   * @param assets - Bienes vendidos
   */
  sellAssets(client: Clients, date: Date, ...assets: Stock[]): void {
    if (db.data.clients.includes(client)) {
      assets.forEach((asset) => {
        if (!this._assetsList.find((stock) => stock[0] === asset[0] && asset[1] <= stock[1] )) {
          throw new Error("El bien que quieres vender no está disponible o no cuenta con el suficiente stock");
        }
      });

      assets.forEach((asset) => {
        this.removeAssets(asset);
      });

      this._transactions.push(new SellTransaction(date, assets, client));
    } else {
      throw new Error("El cliente al que le quieres vender no existe.");
    }
  }
}