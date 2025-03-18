import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import { Transaction } from "../transactions/transaction.js";
import { db } from "../database/database.js";

/**
 * Tipo Stock. Representa una tupla que almacena un bien y el número del mismo que hay en stock
 */
type Stock = [Assets, number];

/**
 * Clase Inventary. Representa un inventario compuesto de bienes, mercaderes y clientes
 */
export class Inventary {

  private _transactions: Transaction[] = [];

  /**
   * Constructor de Inventary
   * @param _assetsList - Lista de bienes
   * @param _money - Dinero en coronas
   */
  constructor(private _assetsList: Stock[], private _money: number) { }

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
   * Getter de money
   */
  get money() {
    return this._money;
  }

  /**
   * Setter de money
   */
  set money(crowns: number) {
    this._money = crowns;
  }
  
  /**
   * Añade al inventario un bien
   * @param stock - Bien y su cantidad a añadir
   */
  addAssets(stock: Stock): void {
    if (this._assetsList.some((asset) => asset[0] === stock[0])) {
      const index: number = this._assetsList.findIndex((asset) => asset[0] === stock[0]);
      this._assetsList[index][1] += stock[1];
    } else {
      this._assetsList.push(stock);
    }
  }

  buyAssets(merchant: Merchant, ...assets: Stock[]): void {
    if (db.data.merchants.includes(merchant)) {
      assets.forEach((asset) => {
        if (!db.data.assets.find((asst) => asst === asset[0])) {
          throw new Error("El bien que quieres comprar no existe.");
        }
      });

      assets.forEach((asset) => {
        this.addAssets(asset);
      });
    } else {
      throw new Error("El mercader al que le quieres comprar no existe.");
    }
  }
  
  /**
   * Elimina un bien del inventario
   * @param asset - Bien a eliminar
   */
  removeAsset(asset: Assets): void {
    this._assetsList.forEach((element, index) => {
      if (element[0] === asset && element[1] > 1 ) this._assetsList[index][1]--;
      else if (element[0] === asset)this._assetsList.filter(element => element[0] !== asset);
      else throw new Error('No se ha encontrado el bien especificado');
    })
  }
}