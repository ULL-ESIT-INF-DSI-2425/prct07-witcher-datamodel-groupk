import inquirer from "inquirer";
import { db } from "../database/database.js";
import { Assets } from "../items/asset.js";
import { Merchant } from "../characters/merchant.js";
import { Clients } from "../characters/client.js";
import { menu } from "./menu.js";

/**
 * Submenú removeMenu(). Permite las siguientes opciones:
 * Bien: Elimina un bien existente de la base de datos.
 * Mercader: Elimina un mercader existente de la base de datos.
 * Cliente: Elimina un cliente existente de la base de datos.
 * Volver atrás: Vuelve al menú principal.
 */
export async function removeMenu() {
  db.read();

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
      db.read();
      const assets = Array.from(new Set(db.data.assets.map((asset: Assets) => asset.name)));
      if (assets.length === 0) return undefined;

      const { name: asset_name } = await inquirer.prompt([
        { type: "rawlist", name: "name", message: "Seleccione el bien:", choices: assets }
      ]);

      await removeAsset(asset_name);
      break;

    case "Mercader":
      db.read();
      const merchants = Array.from(new Set(db.data.merchants.map((merchant: Merchant) => merchant.name)));
      if (merchants.length === 0) return undefined;

      const { name: merchant_name } = await inquirer.prompt([
        { type: "rawlist", name: "name", message: "Seleccione el mercader:", choices: merchants }
      ]);

      await removeMerchant(merchant_name);
      break;

    case "Cliente":
      db.read();
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

/**
 * Elimina un bien de la base de datos dado su nombre.
 * @param name - Nombre del bien a eliminar.
 */
export function removeAsset(name: string): void {
  db.read();

  const index = db.data.assets.findIndex((asset: Assets) => asset.name === name);
  if (index !== -1) {
    db.data.assets.splice(index, 1);
    db.write();
  } 
}

/**
 * Elimina un mercader de la base de datos dado su nombre.
 * @param name - Nombre del mercader a eliminar.
 */
export function removeMerchant(name: string): void {
  db.read();
  db.data.merchants = db.data.merchants.filter((merchant: Merchant) => merchant.name !== name);
  db.write();
}

/**
 * Elimina un cliente de la base de datos dado su nombre.
 * @param name - Nombre del cliente a eliminar.
 */
export function removeClient(name: string):void {
  db.read();
  db.data.clients = db.data.clients.filter((client: Clients) => client.name !== name);
  db.write();
}