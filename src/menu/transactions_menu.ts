import inquirer from "inquirer";
import  { menu, inventary } from "../menu/menu.js"
import { Stock } from "../types/stock.js";
import { db } from "../database/database.js";
import { Merchant } from "../characters/merchant.js";
import { MerchantJSON } from "../interfaces/interfaces_json.js";
import { Date } from "../utils/date.js";

export async function transactionMenu() {
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "¿Qué tipo de transacción deseas realizar?",
      choices: ["Compra", "Venta", "Volver atrás"],
    },
  ]);

  switch (option) {
    case "Compra":
      const { merchant } = await inquirer.prompt([
          { type: "input", name: "merchant", message: "Ingrese el merchant de la compra: " },
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

        const { number_buy } = await inquirer.prompt([
            { type: "input", name: "number_buy", message: "Ingrese el número que desea comprar: "}
        ]);

        purchases.push([asset_buy, number_buy]);

        const { buy_more } = await inquirer.prompt([
            { type: "confirm", name: "buy_more", message: "¿Desea comprar otro bien? (true - false) ", default: false }
        ]);
        continuar = buy_more;
      }
      inventary.buyAssets(selected_merchant, date, ...purchases);
      break;
    case "Venta":
      const { clients } = await inquirer.prompt([
          { type: "input", name: "clients", message: "Ingrese el cliente de la compra:" },
      ]);
      const { date_sell } = await inquirer.prompt([
          { type: "input", name: "date_sell", message: "Ingrese la fecha de la transacción (XX-XX-XXXX): " },
      ]);
      const { asset_sell } = await inquirer.prompt([
          { type: "input", name: "asset_sell", message: "Ingrese el bien a vender: " },
      ]);
      const { number_sell } = await inquirer.prompt([
          { type: "input", name: "number_sell", message: "Ingrese el numero que desea comprar: " },
      ]);
      break;
    case "Volver atrás":
      break;
  }
}