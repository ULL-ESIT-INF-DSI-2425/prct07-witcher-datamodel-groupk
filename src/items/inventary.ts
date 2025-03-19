import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import { Transaction } from "../transactions/transaction.js";
import { Stock } from "../types/stock.js";
import { Date } from "../utils/date.js";
import { db } from "../database/database.js";
import { BuyTransaction } from "../transactions/buyTransaction.js";
import { SellTransaction } from "../transactions/sellTransation.js";

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
   * Setter de assetsList
   */
  set assetsList(assets: Stock[]) {
    this._assetsList = assets;
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

  sellAssets(client: Clients, date: Date, ...assets: Stock[]): void {
    if (db.data.clients.includes(client)) {
      assets.forEach((asset) => {
        if (!this._assetsList.find((stock) => stock[0] === asset[0] && asset[0] <= stock[0] )) {
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
  
  /**
   * Elimina un bien del inventario
   * @param stock - Bien a eliminar
   */
  private removeAssets(stock: Stock): void {
    this._assetsList.forEach((element, index) => {
      if (element[0] === stock[0] && element[1] >= stock[1] ) {
        this._assetsList[index][1] -= stock[1];
        
        if (this._assetsList[index][1] === 0) {
          this._assetsList.splice(index);
        }
      } else {
        throw new Error('No se ha encontrado el bien especificado');
      }
    });
  }
}