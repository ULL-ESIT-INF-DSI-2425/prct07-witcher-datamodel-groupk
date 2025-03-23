import inquirer from "inquirer";
import  { menu, inventary } from "../menu/menu.js"
import { Stock } from "../types/stock.js";
import { db } from "../database/database.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import { Assets } from "../items/asset.js";
import { AssetJSON } from "../interfaces/interfaces_json.js";
import { MerchantJSON } from "../interfaces/interfaces_json.js";
import { ClientsJSON } from "../interfaces/interfaces_json.js";
import { Date } from "../utils/date.js";
import { BuyTransaction } from "../transactions/buyTransaction.js";
import { SellTransaction } from "../transactions/sellTransation.js";
import { RefundBuyTransaction } from "../transactions/refundBuyTransaction.js"

/**
 * Submenú transactionMenu(). Permite realizar una operación o transacción con un bien:
 * Compra: Permite a un cliente comprar un bien.
 * Venta: Permite a un mercader vender un bien.
 * Devolución de un objeto: Permite a un cliente devolver el bien al mercader.
 * Reembolso de dinero: Permite a un mercader devolverle el dinero al cliente.
* Volver atrás: Vuelve al menú principal.
 */
export async function transactionMenu() {
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "¿Qué tipo de transacción deseas realizar?",
      choices: ["Compra", "Venta", "Devolución de un objeto", "Reembolso de dinero", "Volver atrás"],
    },
  ]);

  switch (option) {
    case "Compra":
      db.read();
      const { merchant } = await inquirer.prompt([
          { type: "input", name: "merchant", message: "Ingrese el mercader al que le compra: " },
      ]);
      
      const result = await buyAndRefund(merchant);
      if (!result) {
        console.log("No se pudo procesar la transacción.");
        return;
      }
      inventary.buyAssets(result.selected_merchant, result.date, ...result.purchases);
      console.table(inventary.getStockReport().map((stock) => ({
          name: stock[0].name,
          quantity: stock[1]
      })));

      console.table(inventary.transactions.filter((trans) => trans instanceof BuyTransaction).map((trans => ({
        date: trans.date.getDate(),
        assets: trans.getExchangeAssets().map((stock) => "[" + stock[0].name + ", " + stock[1].toString() + "]").join(", "),
        client: trans.merchant.name,
        crowns: trans.crowns
      }))));
      break;
    case "Venta":
      db.read();
      const { client } = await inquirer.prompt([
          { type: "input", name: "client", message: "Ingrese el comprador:" },
      ]);
      const result_sell = await sellAndRefund(client);
      if (!result_sell) {
        console.log("No se pudo hacer la transacción");
        return;
      }
      inventary.sellAssets(result_sell.selected_client , result_sell.date_Sell, ...result_sell.purchases_sell);
      console.table(inventary.getStockReport().map((stock) => ({
        name: stock[0].name,
        quantity: stock[1]
      })));

      console.table(inventary.transactions.filter((trans) => trans instanceof SellTransaction).map((trans => ({
        date: trans.date.getDate(),
        assets: trans.getExchangeAssets().map((stock) => "[" + stock[0].name + ", " + stock[1].toString() + "]").join(", "),
        client: trans.client.name,
        crowns: trans.crowns
      }))));
      break;
    case "Devolución de un objeto":
      db.read();
      const { client_refund } = await inquirer.prompt([
          { type: "input", name: "client_refund", message: "Ingrese el comprador:" },
      ]);
      const result_buy = await sellAndRefund(client_refund);
      if (!result_buy) {
        console.log("No se pudo hacer la transacción");
        return;
      }
      inventary.refundSellAssets(result_buy.selected_client, result_buy.date_Sell, ...result_buy.purchases_sell);
      console.table(inventary.getStockReport().map((stock) => ({
        name: stock[0].name,
        quantity: stock[1]
      })));

      console.table(inventary.transactions.filter((trans) => trans instanceof SellTransaction).map((trans => ({
        date: trans.date.getDate(),
        assets: trans.getExchangeAssets().map((stock) => "[" + stock[0].name + ", " + stock[1].toString() + "]").join(", "),
        client: trans.client.name,
        crowns: trans.crowns
      }))));
      break;
    case "Reembolso de dinero":
      db.read();
      const { merchant_refund } = await inquirer.prompt([
          { type: "input", name: "merchant_refund", message: "Ingrese el mercader al que le compra: " },
      ]);
      const result_refund = await buyAndRefund(merchant_refund);
      if (!result_refund) {
        console.log("No se pudo procesar la transacción.");
        return;
      }
      inventary.refundBuyAssets(result_refund.selected_merchant, result_refund.date, ...result_refund.purchases);
      console.table(inventary.getStockReport().map((stock) => ({
        name: stock[0].name,
        quantity: stock[1]
    })));

    console.table(inventary.transactions.filter((trans) => trans instanceof RefundBuyTransaction).map((trans => ({
      date: trans.date.getDate(),
      assets: trans.getExchangeAssets().map((stock) => "[" + stock[0].name + ", " + stock[1].toString() + "]").join(", "),
      client: trans.merchant.name,
      crowns: trans.crowns
    }))));
      break;
    case "Volver atrás":
      await menu();
      return;
  }
  
  await transactionMenu();
}

/**
 * Solicita al usuario los datos a realizar una transación de compra y reembolso
 * @param merchant_name - El nombre del mercader al que se le realizará la compra.
 * @returns - Una promesa (puesto que es una función asincrona) que contiene:
 *           - selected_merchant: La instancia del mercader seleccionado.
 *           - date: La fecha de la transacción.
 *           - purchases: Un array de Stock, donde cada elemento es un par [bien, cantidad].
 *          Si el mercader o algún bien ingresado no es válido, retorna undefined.
 */
async function buyAndRefund(merchant_name: string): Promise<{ selected_merchant: Merchant; date: Date; purchases: Stock[] } | undefined> {
  const merchants: Merchant[] = db.data.merchants.map(merchant => Merchant.fromJSON(merchant as unknown as MerchantJSON));
  const selected_merchant: Merchant | undefined = merchants.find(merchant => merchant.name.toLowerCase() === merchant_name.toLowerCase());
  if (typeof selected_merchant === "undefined") {
    console.log("El mercader no es válido.");
    return;
  }

  const { date_buy } = await inquirer.prompt([
      { type: "input", name: "date_buy", message: "Ingrese la fecha de la transacción (XX-XX-XXXX): " },
  ]);
  
  const [day_str, month_str, year_str] = date_buy.split("-");
  const day = Number(day_str);
  const month = Number(month_str);
  const year = Number(year_str);

  let date: Date = new Date(day, month, year);
  
  let continuar = true;
  const purchases: Stock[] = [];

  while (continuar) {
    const { asset_buy } = await inquirer.prompt([
        { type: "input", name: "asset_buy", message: "Ingrese el bien: " }
    ]);

    const assets: Assets[] = db.data.assets.map(asset => Assets.fromJSON(asset as unknown as AssetJSON));
    const selected_asset: Assets | undefined = assets.find(asset => asset.name.toLowerCase() === asset_buy.toLowerCase());
    if (typeof selected_asset === "undefined") {
      console.log("El bien no es válido.");
      return;
    }

    const { number_buy } = await inquirer.prompt([
        { type: "number", name: "number_buy", message: "Ingrese el número de bienes: "}
    ]);

    purchases.push([selected_asset, number_buy]);

    const { buy_more } = await inquirer.prompt([
        { type: "confirm", name: "buy_more", message: "¿Desea realizar otra acción? (true - false) ", default: false }
    ]);
    continuar = buy_more;
  }
  return {selected_merchant, date, purchases};
}

/**
 * Solicita al usuario los datos a realizar una transación de venta y devolución
 * @param client_name - El nombre del cliente al que se le realizá la venta
 * @return - Una promesa (puesto que es una función asincrona) que contiene:
 *           - selected_client: La instancia del cliente seleccionado.
 *           - date: La fecha de la transacción.
 *           - purchases: Un array de Stock, donde cada elemento es un par [bien, cantidad].
 *          Si el mercader o algún bien ingresado no es válido, retorna undefined.
 */
async function sellAndRefund(client_name: string): Promise<{ selected_client: Clients; date_Sell: Date; purchases_sell: Stock[] } | undefined> {
  const clients: Clients[] = db.data.clients.map(client => Clients.fromJSON(client as unknown as ClientsJSON));
    const selected_client: Clients | undefined = clients.find(client => client.name.toLowerCase() === client_name.toLowerCase());
    if (typeof selected_client === "undefined") {
      console.log("El cliente no es válido.");
      return;
    }
    const { date_sell } = await inquirer.prompt([
      { type: "input", name: "date_sell", message: "Ingrese la fecha de la transacción (XX-XX-XXXX): " },
    ]);
    
    const [day_str_sell, month_str_sell, year_str_sell] = date_sell.split("-");
    const day_sell = Number(day_str_sell);
    const month_sell = Number(month_str_sell);
    const year_sell = Number(year_str_sell);

    let date_Sell: Date = new Date(day_sell, month_sell, year_sell);

    let continuar_sell = true;
    const purchases_sell: Stock[] = [];

    while (continuar_sell) {
      const { asset_sell } = await inquirer.prompt([
          { type: "input", name: "asset_sell", message: "Ingrese el bien: " }
      ]);
      
      const assets: Assets[] = db.data.assets.map(asset => Assets.fromJSON(asset as unknown as AssetJSON));
      const selected_asset: Assets | undefined = assets.find(asset => asset.name.toLowerCase() === asset_sell.toLowerCase());
      if (typeof selected_asset === "undefined") {
        console.log("El bien no es válido.");
        return;
      }
      const { number_sell } = await inquirer.prompt([
          { type: "number", name: "number_sell", message: "Ingrese el número de bienes: "}
      ]);

      purchases_sell.push([selected_asset, number_sell]);

      const { sell_more } = await inquirer.prompt([
          { type: "confirm", name: "sell_more", message: "¿Desea realizar otra acción? (true - false) ", default: false }
      ]);
      continuar_sell = sell_more;
    }
    return {selected_client, date_Sell, purchases_sell};
}