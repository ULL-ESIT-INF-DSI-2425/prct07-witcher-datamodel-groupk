import inquirer from "inquirer";
import { removeAsset, removeMerchant, removeClient } from "../database/database.js";
import { db } from "../database/database.js";
import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js"

//const inventary = new Inventary();

export async function removeMenu() {
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "¿Qué desea eliminar?",
      choices: ["Bien", "Mercader", "Cliente", "Volver atrás"],
    },
  ]);

  switch (option) {
    case "Bien":
      const assets = db.data.assets.map((asset: Assets) => asset.name);
      if (assets.length === 0) return undefined;

      const { name: asset_name } = await inquirer.prompt([
        { type: "list", name: "name", message: "Seleccione el bien:", choices: assets }
      ]);

      await removeAsset(asset_name);
      break;

    case "Mercader":
      const merchants = db.data.merchants.map((merchant: Merchant) => merchant.name);
      if (merchants.length === 0) return undefined;

      const { name: merchant_name } = await inquirer.prompt([
        { type: "list", name: "name", message: "Seleccione el mercader:", choices: merchants }
      ]);

      await removeMerchant(merchant_name);
      break;

    case "Cliente":
      const clients = db.data.clients.map((client: Clients) => client.name);
      if (clients.length === 0) return undefined;

      const { name: client_name } = await inquirer.prompt([
        { type: "list", name: "name", message: "Seleccione el cliente:", choices: clients }
      ]);

      await removeClient(client_name);
      break;

    case "Volver atrás":
      return;
  }
  
  await removeMenu();
}