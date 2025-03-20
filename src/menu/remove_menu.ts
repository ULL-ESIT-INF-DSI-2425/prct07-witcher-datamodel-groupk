import inquirer from "inquirer";
import { removeAsset, removeMerchant, removeClient } from "../database/database.js";
import { db } from "../database/database.js";
import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import { menu } from "../menu/menu.js";


export async function removeMenu() {
  await db.read();

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
      await db.read();
      const assets = Array.from(new Set(db.data.assets.map((asset: Assets) => asset.name)));
      if (assets.length === 0) return undefined;

      const { name: asset_name } = await inquirer.prompt([
        { type: "rawlist", name: "name", message: "Seleccione el bien:", choices: assets }
      ]);

      await removeAsset(asset_name);
      break;

    case "Mercader":
      await db.read();
      const merchants = Array.from(new Set(db.data.merchants.map((merchant: Merchant) => merchant.name)));
      if (merchants.length === 0) return undefined;

      const { name: merchant_name } = await inquirer.prompt([
        { type: "rawlist", name: "name", message: "Seleccione el mercader:", choices: merchants }
      ]);

      await removeMerchant(merchant_name);
      break;

    case "Cliente":
      await db.read();
      const clients = db.data.clients.map((client: Clients) => client.name);
      if (clients.length === 0) return undefined;

      const { name: client_name } = await inquirer.prompt([
        { type: "rawlist", name: "name", message: "Seleccione el cliente:", choices: clients }
      ]);

      await removeClient(client_name);
      break;

    case "Volver atrás":
      menu();
      return;
  }
  
  await removeMenu();
}