import inquirer from "inquirer";
import { updateAsset, updateMerchant, updateClient } from "../database/database.js";
import * as Enums from "../enums/types-and-races.js"
import { db } from "../database/database.js"
import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import { menu } from "../menu/menu.js"

export async function modifyMenu() {
  await db.read();

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
        { type: "rawlist", name: "name", message: "Seleccione el bien a modificar:", choices: assets },
      ]);

      const updated_asset_data = await inquirer.prompt([
        { type: "input", name: "description", message: "Nueva descripción (dejar vacío para no cambiar):" },
        { type: "input", name: "materials", message: "Nuevos materiales (dejar vacío para no cambiar):" },
        { type: "number", name: "weight", message: "Nuevo peso (0 para no cambiar):" },
        { type: "number", name: "crowns", message: "Nuevo valor en coronas (0 para no cambiar):" },
      ]);

      const index = db.data.assets.findIndex(asset => asset.name === asset_name);

      // Arreglar 
      await updateAsset(asset_name, {
        description: updated_asset_data.description || db.data.assets[index].description,
        materials: updated_asset_data.materials && updated_asset_data.materials.trim() !== ""  ? updated_asset_data.materials.split(",") : db.data.assets[index].materials,
        weight: updated_asset_data.weight !== 0 ? updated_asset_data.weight : db.data.assets[index].weight,
        crowns: updated_asset_data.crowns !== 0 ? updated_asset_data.crowns : db.data.assets[index].crowns,
      });
      
      await db.write();
      break;

    case "Mercader":
      const merchants = db.data.merchants.map((merchant: Merchant) => merchant.name);
      if (merchants.length === 0) return;
      
      const { name: merchant_name } = await inquirer.prompt([
        { type: "rawlist", name: "name", message: "Seleccione el mercader a modificar:", choices: merchants },
      ]);

      const updated_merchant_data = await inquirer.prompt([
        { type: "input", name: "location", message: "Nueva ubicación (dejar vacío para no cambiar):" },
        { type: "list", name: "type", message: "Nuevo tipo de mercader:", choices: Object.values(Enums.Type).filter(value => isNaN(Number(value))).map(String) },
      ]);

      await updateMerchant(merchant_name, {
        location: updated_merchant_data.location || undefined,
        type: updated_merchant_data.type || undefined,
      });

      await db.write();
      break;

    case "Cliente":
      const clients = db.data.clients.map((client: Clients) => client.name);
      if (clients.length === 0) return;

      const { name: client_name } = await inquirer.prompt([
        { type: "rawlist", name: "name", message: "Seleccione el cliente a modificar:", choices: clients },
      ]);

      const updated_client_data = await inquirer.prompt([
        { type: "input", name: "location", message: "Nueva ubicación (dejar vacío para no cambiar):" },
        { type: "list", name: "race", message: "Nueva raza:", choices: Object.values(Enums.Race).filter(value => isNaN(Number(value))).map(String) },
      ]);

      await updateClient(client_name, {
        location: updated_client_data.location || undefined,
        race: updated_client_data.race || undefined,
      });

      await db.write();
      break;

    case "Volver atrás":
      await menu();
      return;
  }

  await modifyMenu();
}