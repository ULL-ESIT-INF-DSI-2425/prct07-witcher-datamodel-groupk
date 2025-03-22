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

export async function transactionMenu() {
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "¿Qué tipo de transacción deseas realizar?",
      choices: ["Compra", "Venta", "Devolución", "Reembolso", "Volver atrás"],
    },
  ]);

  switch (option) {
    case "Compra":
      db.read();
      const { merchant } = await inquirer.prompt([
          { type: "input", name: "merchant", message: "Ingrese el mercader al que le compra: " },
      ]);
      const merchants: Merchant[] = db.data.merchants.map(merchant => Merchant.fromJSON(merchant as unknown as MerchantJSON));
      const selected_merchant: Merchant | undefined = merchants.find(merchant_ => merchant_.name.toLowerCase() === merchant.toLowerCase());
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
            { type: "input", name: "asset_buy", message: "Ingrese el bien a comprar: " }
        ]);

        const assets: Assets[] = db.data.assets.map(asset => Assets.fromJSON(asset as unknown as AssetJSON));
        const selected_asset: Assets | undefined = assets.find(asset => asset.name.toLowerCase() === asset_buy.toLowerCase());
        if (typeof selected_asset === "undefined") {
          console.log("El bien no es válido.");
          return;
        }

        const { number_buy } = await inquirer.prompt([
            { type: "number", name: "number_buy", message: "Ingrese el número que desea comprar: "}
        ]);

        purchases.push([selected_asset, number_buy]);

        const { buy_more } = await inquirer.prompt([
            { type: "confirm", name: "buy_more", message: "¿Desea comprar otro bien? (true - false) ", default: false }
        ]);
        continuar = buy_more;
      }
      inventary.buyAssets(selected_merchant, date, ...purchases);

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

      await menu();
      return;
    case "Venta":
      db.read();
      const { client } = await inquirer.prompt([
          { type: "input", name: "client", message: "Ingrese el cliente de la compra:" },
      ]);
      const clients: Clients[] = db.data.clients.map(client => Clients.fromJSON(client as unknown as ClientsJSON));
      const selected_client: Clients | undefined = clients.find(client_ => client_.name.toLowerCase() === client.toLowerCase());
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
            { type: "input", name: "asset_sell", message: "Ingrese el bien a vender: " }
        ]);
        
        const assets: Assets[] = db.data.assets.map(asset => Assets.fromJSON(asset as unknown as AssetJSON));
        const selected_asset: Assets | undefined = assets.find(asset => asset.name.toLowerCase() === asset_sell.toLowerCase());
        if (typeof selected_asset === "undefined") {
          console.log("El bien no es válido.");
          return;
        }
        console.log("bien");
        const { number_sell } = await inquirer.prompt([
            { type: "number", name: "number_sell", message: "Ingrese el número que desea comprar el cliente: "}
        ]);

        purchases_sell.push([selected_asset, number_sell]);

        const { sell_more } = await inquirer.prompt([
            { type: "confirm", name: "sell_more", message: "¿Desea comprar otro bien? (true - false) ", default: false }
        ]);
        continuar_sell = sell_more;
      }
      inventary.sellAssets(selected_client, date_Sell, ...purchases_sell);
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

      await menu();
      return;
    case "Volver atrás":
      await menu();
      return;
  }
}