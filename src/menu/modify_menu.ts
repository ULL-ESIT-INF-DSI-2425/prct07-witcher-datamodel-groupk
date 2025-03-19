import inquirer from "inquirer";
import { updateAsset, updateMerchant, updateClient } from "../database/database.js";
import * as Enums from "../enums/types-and-races.js"
import { db } from "../database/database.js"
import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";

export async function modifyMenu() {
  const { option } = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "¿Qué desea modificar?",
      choices: ["Bien", "Mercader", "Cliente", "Volver atrás"],
    },
  ]);

  switch (option) {
    case "Bien":
      const assets = db.data.assets.map((asset: Assets) => asset.name);
      if (assets.length === 0) return;

      const { name: asset_name } = await inquirer.prompt([
        { type: "list", name: "name", message: "Seleccione el bien a modificar:", choices: assets },
      ]);

      const updated_asset_data = await inquirer.prompt([
        { type: "input", name: "description", message: "Nueva descripción (dejar vacío para no cambiar):" },
        { type: "input", name: "materials", message: "Nuevos materiales (dejar vacío para no cambiar):" },
        { type: "number", name: "weight", message: "Nuevo peso (0 para no cambiar):" },
        { type: "number", name: "crowns", message: "Nuevo valor en coronas (0 para no cambiar):" },
        { type: "number", name: "quantity", message: "Nueva cantidad en stock (-1 para no cambiar):" },
      ]);

      await updateAsset(asset_name, {
        description: updated_asset_data.description || undefined,
        materials: updated_asset_data.materials ? updated_asset_data.materials.split(",") : undefined,
        weight: updated_asset_data.weight || undefined,
        crowns: updated_asset_data.crowns || undefined,
      });

      break;

    case "Mercader":
      const merchants = db.data.assets.map((merchant: Merchant) => merchant.name);
      if (merchants.length === 0) return;
      
      const { name: merchant_name } = await inquirer.prompt([
        { type: "list", name: "name", message: "Seleccione el mercader a modificar:", choices: merchants },
      ]);

      const updated_merchant_data = await inquirer.prompt([
        { type: "input", name: "location", message: "Nueva ubicación (dejar vacío para no cambiar):" },
        { type: "list", name: "type", message: "Nuevo tipo de mercader:", choices: Object.values(Enums.Type) },
      ]);

      await updateMerchant(merchant_name, {
        location: updated_merchant_data.location || undefined,
        type: updated_merchant_data.type || undefined,
      });

      break;

    case "Cliente":
      const clients = db.data.assets.map((client: Clients) => clients.name);
      if (clients.length === 0) return;

      const { name: client_name } = await inquirer.prompt([
        { type: "list", name: "name", message: "Seleccione el cliente a modificar:", choices: clients },
      ]);

      const updated_client_data = await inquirer.prompt([
        { type: "input", name: "location", message: "Nueva ubicación (dejar vacío para no cambiar):" },
        { type: "list", name: "race", message: "Nueva raza:", choices: Object.values(Enums.Race) },
      ]);

      await updateClient(client_name, {
        location: updated_client_data.location || undefined,
        race: updated_client_data.race || undefined,
      });

      break;

    case "Volver atrás":
      return;
  }

  await modifyMenu();
}

