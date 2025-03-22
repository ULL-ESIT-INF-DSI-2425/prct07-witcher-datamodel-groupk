import inquirer from "inquirer";
import * as Enums from "../enums/types-and-races.js"
import { db } from "../database/database.js"
import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import { menu } from "./menu.js"

/**
 * Submenú modifyMenu(). Permite las siguientes opciones:
 * Bien: Modifica un bien existente de la base de datos.
 * Mercader: Modifica un mercader existente de la base de datos.
 * Cliente: Modifica un cliente existente de la base de datos.
 * Volver atrás: Vuelve al menú principal.
 */
export async function modifyMenu() {
  db.read();

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
      db.read();

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
      updateAsset(asset_name, {
        description: updated_asset_data.description || db.data.assets[index].description,
        materials: updated_asset_data.materials && updated_asset_data.materials.trim() !== ""  ? updated_asset_data.materials.split(",") : db.data.assets[index].materials,
        weight: updated_asset_data.weight !== 0 ? updated_asset_data.weight : db.data.assets[index].weight,
        crowns: updated_asset_data.crowns !== 0 ? updated_asset_data.crowns : db.data.assets[index].crowns,
      });
      
      db.write();
      break;

    case "Mercader":
      db.read();

      const merchants = db.data.merchants.map((merchant: Merchant) => merchant.name);
      if (merchants.length === 0) return;
      
      const { name: merchant_name } = await inquirer.prompt([
        { type: "rawlist", name: "name", message: "Seleccione el mercader a modificar:", choices: merchants },
      ]);

      const updated_merchant_data = await inquirer.prompt([
        { type: "input", name: "location", message: "Nueva ubicación (dejar vacío para no cambiar):" },
        { type: "list", name: "type", message: "Nuevo tipo de mercader:", choices: Object.values(Enums.Type).filter(value => isNaN(Number(value))).map(String) },
      ]);

      updateMerchant(merchant_name, {
        location: updated_merchant_data.location || undefined,
        type: updated_merchant_data.type || undefined,
      });

      db.write();
      break;

    case "Cliente":
      db.read();

      const clients = db.data.clients.map((client: Clients) => client.name);
      if (clients.length === 0) return;

      const { name: client_name } = await inquirer.prompt([
        { type: "rawlist", name: "name", message: "Seleccione el cliente a modificar:", choices: clients },
      ]);

      const updated_client_data = await inquirer.prompt([
        { type: "input", name: "location", message: "Nueva ubicación (dejar vacío para no cambiar):" },
        { type: "list", name: "race", message: "Nueva raza:", choices: Object.values(Enums.Race).filter(value => isNaN(Number(value))).map(String) },
      ]);

      updateClient(client_name, {
        location: updated_client_data.location || undefined,
        race: updated_client_data.race || undefined,
      });

      db.write();
      break;

    case "Volver atrás":
      await menu();
      return;
  }

  await modifyMenu();
}

/**
 * Permite modificar un bien.
 * @param name - Nombre del bien a modificar.
 * @param updated_data - Datos del bien a modificar. 
 */
export function updateAsset(name: string, updated_data: Partial<Assets>): void {
  db.read();

  const index = db.data.assets.findIndex((asset: Assets) => asset.name === name);
  if (index !== -1) {
    const old_asset_data = db.data.assets[index];
    db.data.assets[index] = new Assets(
      updated_data.name ?? old_asset_data.name,
      updated_data.description ?? old_asset_data.description,
      updated_data.materials !== undefined ? updated_data.materials : old_asset_data.materials,
      updated_data.weight ?? old_asset_data.weight,
      updated_data.crowns ?? old_asset_data.crowns
    );
    db.write();
  }
}

/**
 * Permite modificar el estado de un mercader.
 * @param name - Nombre del mercader a modificar.
 * @param updated_data - Datos del mercader a modificar.
 */
export function updateMerchant(name: string, updated_data: Partial<Merchant>): void {
  db.read();
  
  const index = db.data.merchants.findIndex((merchant: Merchant) => merchant.name === name);
  if (index !== -1) {
    const old_merchant_data = db.data.merchants[index];
    db.data.merchants[index] = new Merchant(
      updated_data.name ?? old_merchant_data.name,
      updated_data.location ?? old_merchant_data.location,
      updated_data.type ?? old_merchant_data.type
    );
    db.write(); 
  } 
}

/**
 * Permite modificar el estado de un cliente.
 * @param name - Nombre del cliente a modificar.
 * @param updated_data - Datos del cliente a modificar. 
 */
export function updateClient(name: string, updated_data: Partial<Clients>): void {
  db.read();

  const index = db.data.clients.findIndex((client: Clients) => client.name === name);
  if (index !== -1) {
    const old_client_data = db.data.clients[index];
    db.data.clients[index] = new Clients(
      updated_data.name ?? old_client_data.name,
      updated_data.location ?? old_client_data.location,
      updated_data.race ?? old_client_data.race
    );
    db.write();
  }
}