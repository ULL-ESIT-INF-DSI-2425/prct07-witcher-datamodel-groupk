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
import { Assets } from "./asset.js";
import { AssetJSON, ClientsJSON } from "../interfaces/interfaces_json.js";
import { AssetManager } from "../managers/assets_manager.js";
import { MerchantJSON } from "../interfaces/interfaces_json.js";
import _ from 'lodash';

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
   * Inicializa el inventario con el stock y bienes de la base de datos.
   * @returns - Objeto tipo inventario.
   */
  static buildInventaryFromDB(): Inventary {
    db.read();

    let assets: Assets[] = db.data.assets.map(asset => Assets.fromJSON(asset as unknown as AssetJSON));
  
    let asset_manager = new AssetManager(assets);
    assets = asset_manager.sortByName(true);
  
    const inventary = new Inventary([]);
    
    const repeat_assets: [Assets, number][] = [];
    let counter: number = 0, i = 0;

    assets.forEach((asset, index) => {
      if (index === 0 || (asset.name === assets[index - 1].name && asset.description === assets[index - 1].description)) counter++;
      else {
        repeat_assets.push([assets[index - 1], counter]);
        counter = 1;
      }
      i = index;
    });
  
    repeat_assets.push([assets[i], counter]);
      repeat_assets.forEach(asset => {
      inventary.addAssets(asset);
    });
  
    return inventary;
  }
  
  /**
   * Añade al inventario un bien
   * @param stock - Bien y su cantidad a añadir
   */
  private addAssets(stock: Stock): void {
    if (this._assetsList.some((asset) => _.isEqual(asset[0], stock[0]))) {
      const index: number = this._assetsList.findIndex((asset) => _.isEqual(asset[0], stock[0]));
      console.log(this._assetsList[index])
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
        if (_.isEqual(element[0], stock[0])) {
          element[1] -= stock[1];

          if (element[1] <= 0) {
            this._assetsList.splice(index, 1);
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
  buyAssets(merchant: Merchant, date: Date, ...stocks: Stock[]): void {
    db.read();

    const merchants: Merchant[] = db.data.merchants.map(merchant => Merchant.fromJSON(merchant as unknown as MerchantJSON));
    const assets: Assets[] = db.data.assets.map(asset => Assets.fromJSON(asset as unknown as AssetJSON));

    if (merchants.some(m => m.id === merchant.id)) {
      stocks.forEach((stock) => {
        if (!assets.some((asst) => _.isEqual(asst, stock[0]))) { 
          throw new Error("El bien que quieres comprar no existe.");
        }
      });

      const goods: Assets[] = [];
      const quantity: number[] = [];

      stocks.forEach((stock) => {
        this.addAssets(stock);
        goods.push(stock[0]);
        quantity.push(stock[1]);
      });

      this._transactions.push(new BuyTransaction(date, goods, quantity, merchant));
    } else {
      throw new Error("El mercader al que le quieres comprar no existe.");
    }
  }

  /**
   * Realiza la devolución de bienes a un mercader
   * @param merchant - Mercader al que pedirle la devolución
   * @param date - Fecha en la que se realiza la devolución
   * @param assets - Bienes a devolver
   */
  refundBuyAssets(merchant: Merchant, date: Date, ...assets: Stock[]): void {
    const goods: Assets[] = [];
    const quantity: number[] = [];

    let qnt: number;
    
    assets.forEach((asset) => {
      qnt = 0;

      if (!this._assetsList.some((stock) => _.isEqual(stock[0], asset[0]) && stock[1] >= asset[1])) {
        throw new Error("No tienes del bien que quieres devolver.");
      }

      this._transactions.forEach((trans) => {
        if (trans instanceof BuyTransaction && trans.merchant.id === merchant.id && trans.date.isLowerOrEqualThan(date)) {
          trans.getExchangeAssets().forEach((good) => {
            if (good[0].id === asset[0].id) {
              qnt += good[1];
            }
          });
        }
      });

      if (qnt === 0) {
        throw new Error("No se realizó ninguna transacción sobre algún bien con ese mercader hasta el momento.");
      } else if (qnt < asset[1]) {
        throw new Error("Entre todas las compras a ese mercader, no se compró tanta cantidad de uno de los bienes.");
      }

      this.removeAssets(asset);
      goods.push(asset[0]);
      quantity.push(asset[1]);
    });

    this._transactions.push(new RefundBuyTransaction(date, goods, quantity, merchant));
  }

  /**
   * Vende una serie de bienes a un cliente
   * @param client - Cliente al que realizar la venta
   * @param date - Fecha en la que se realizó la venta
   * @param assets - Bienes vendidos
   */
  sellAssets(client: Clients, date: Date, ...stocks: Stock[]): void {
    db.read();

    const clients: Clients[] = db.data.clients.map(client => Clients.fromJSON(client as unknown as ClientsJSON));

    if (clients.some(c => _.isEqual(c, client))) {
      stocks.forEach((asset) => {
        if (!this._assetsList.some((stock) => _.isEqual(stock[0], asset[0]) && asset[1] <= stock[1] )) {
          throw new Error("El bien que quieres vender no está disponible o no cuenta con el suficiente stock");
        }
      });

      const goods: Assets[] = [];
      const quantity: number[] = [];

      stocks.forEach((asset) => {
        this.removeAssets(asset);
        goods.push(asset[0]);
        quantity.push(asset[1]);
      });

      this._transactions.push(new SellTransaction(date, goods, quantity, client));
    } else {
      throw new Error("El cliente al que le quieres vender no existe.");
    }
  }

  /**
   * Desembolsa bienes a un cliente
   * @param client - Cliente al que hacer la devolución
   * @param date - Fecha en la que se realizó la devolución
   * @param assets - Bienes a reembolsar
   */
  refundSellAssets(client: Clients, date: Date, ...assets: Stock[]): void {
    const goods: Assets[] = [];
    const quantity: number[] = [];

    let qnt: number;
    
    assets.forEach((asset) => {
      qnt = 0;

      this._transactions.forEach((trans) => {
        if (trans instanceof SellTransaction && trans.client.id === client.id && trans.date.isLowerOrEqualThan(date)) {
          trans.getExchangeAssets().forEach((good) => {
            if (good[0].id === asset[0].id) {
              qnt += good[1];
            }
          });
        }
      });

      if (qnt === 0) {
        throw new Error("No se realizó ninguna transacción sobre algún bien con ese cliente hasta el momento.");
      } else if (qnt < asset[1]) {
        throw new Error("Entre todas las ventas a ese cliente, no se compró tanta cantidad de uno de los bienes.");
      }

      this.addAssets(asset);
      goods.push(asset[0]);
      quantity.push(asset[1]);
    });

    this._transactions.push(new RefundSellTransaction(date, goods, quantity, client));
  }

 /**
 * Genera un informe del inventario de bienes disponibles.
 * @param filter - Función opcional que se aplica a cada elemento del inventario 
 * para filtrar los bienes según ciertos criterios.
 * @returns - Array con la lista de bienes en el inventario, filtrados si se proporciona una función de filtro.
 */
 getStockReport(name?: string): Stock[] {
    if (name) {
        return this._assetsList.filter(stock => stock[0].name === name);
    }
    return this._assetsList;
  }
  
 /**
 * Obtiene una lista de los bienes más vendidos en el inventario, ordenados por cantidad vendida en orden descendente.
 * @returns - Array de objetos que contiene cada bien y la cantidad total vendida.
 */
  getBestSellingAssets(): { asset: Assets; sold: number }[] {
    const salesRecords: { asset: Assets; sold: number }[] = [];
    for (let i = 0; i < this._transactions.length; i++) {
      const trans = this._transactions[i];
      if (trans instanceof SellTransaction) {
        const exchangeAssets: Stock[] = trans.getExchangeAssets();
        for (let j = 0; j < exchangeAssets.length; j++) {
          const asset = exchangeAssets[j][0];
          const quantity = exchangeAssets[j][1];
          let found = false;
          for (let k = 0; k < salesRecords.length; k++) {
            if (salesRecords[k].asset === asset) {
              salesRecords[k].sold += quantity;
              found = true;
              break;
            }
          }
          if (!found) {
            salesRecords.push({ asset: asset, sold: quantity });
          }
        }
      }
    }
    salesRecords.sort((a, b) => b.sold - a.sold);
    return salesRecords;
  }  
  
  /**
 * Calcula un resumen financiero basado en las transacciones registradas.
 * @returns - Un objeto (pair de dos numbers) con el total de ingresos y gastos.
 */
  getFinancialSummary(): { totalIncome: number; totalExpenses: number } {
    let totalIncome = 0;
    let totalExpenses = 0;
    this._transactions.forEach((trans) => {
      if (trans instanceof SellTransaction) {
        totalIncome += trans.crowns;
      } else if (trans instanceof BuyTransaction) {
        totalExpenses += trans.crowns;
      } else if (trans instanceof RefundBuyTransaction) {
        totalExpenses -= trans.crowns;
      }
    });
    return { totalIncome, totalExpenses };
  }
  
/**
 * Obtiene el historial de transacciones de venta asociadas a un cliente específico.
 * @param client - El cliente cuyo historial de ventas se desea obtener.
 * @returns - Un array de SellTransaction realizadas por el cliente.
 */
getTransactionHistoryForClient(client: Clients): SellTransaction[] {
  const clientTransactions: SellTransaction[] = [];
  for (let i = 0; i < this._transactions.length; i++) {
    const trans = this._transactions[i];
    if (trans instanceof SellTransaction && trans.client === client) {
      clientTransactions.push(trans);
    }
  }
  return clientTransactions;
}
  
  /**
 * Obtiene el historial de transacciones de compra asociadas a un mercader específico.
 * @param merchant - El mercader cuyo historial de compras se desea obtener.
 * @returns - Un array con todas las transacciones de compra realizadas al mercader.
 */
  getTransactionHistoryForMerchant(merchant: Merchant): BuyTransaction[] {
    const merchantTransactions: BuyTransaction[] = [];
    for (let i = 0; i < this._transactions.length; i++) {
      const trans = this._transactions[i];
      if (trans instanceof BuyTransaction && trans.merchant === merchant) {
        merchantTransactions.push(trans);
      }
    }
    return merchantTransactions;
  }
}